from fastapi import APIRouter, Depends, HTTPException
from ..database.database import Session
from typing import Annotated

from .. import schemas
from ..models import UserModel
from .auth import get_current_user

router = APIRouter()


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


@router.get("/api/users/me", tags=["users"], response_model=schemas.User)
async def read_users_me(
    current_user: Annotated[schemas.User, Depends(get_current_user)],
):
    return current_user


@router.get("/api/users/", tags=["users"], response_model=list[schemas.User])
def get_users(db: Session = Depends(get_db)):
    users = UserModel.return_all(db, 0, 10)
    return users


@router.post("/api/users/", tags=["users"], response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = UserModel.find_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = UserModel(firstname=user.firstname, lastname=user.lastname, email=user.email,
                     hashed_password=UserModel.generate_hash(user.password), is_active=True)
    user.save_to_db(db)
    return user
