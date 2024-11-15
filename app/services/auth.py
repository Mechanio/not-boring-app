from datetime import datetime, timedelta, timezone
from typing import Annotated, Union

from fastapi import  Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from configs.environment import get_environment_variables
from models.user import UserModel
from repositories.user import UserRepository


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
env = get_environment_variables()

class AuthService:
    userRepository: UserRepository

    def __init__(self, userRepository: UserRepository = Depends()) -> None:
        self.userRepository = userRepository

    def authenticate_user(self, email: str, password: str):
        user = self.userRepository.get_by_email(email)
        if not user or not UserModel.verify_hash(password, user.hashed_password):
            return False
        return user

    @staticmethod
    def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, env.JWT_SECRET_KEY, algorithm="HS256")
        return encoded_jwt

    async def get_current_user(self, token: Annotated[str, Depends(oauth2_scheme)]):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, env.JWT_SECRET_KEY, algorithms=["HS256"])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        user = self.userRepository.get_by_email(email)
        if user is None:
            raise credentials_exception
        return user
