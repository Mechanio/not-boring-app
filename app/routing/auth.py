from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from schemas.user import UserCreate
from services.auth import AuthService
from services.user import UserService
from typing import Annotated
from schemas.auth import Token

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


@auth_router.post("/login", tags=["auth"])
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], authService: AuthService = Depends()) -> Token:
    user = authService.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email(username) or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = authService.create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@auth_router.post("/registration", tags=["auth"])
async def registration(user: UserCreate, authService: AuthService = Depends(), userService: UserService = Depends()) -> Token:
    db_user = userService.list(email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = userService.create(user)
    access_token_expires = timedelta(minutes=30)
    access_token = authService.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
