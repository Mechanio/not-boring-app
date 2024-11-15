from typing import List, Optional, Type

from fastapi import Depends
from sqlalchemy.orm import Session, lazyload

from configs.database import get_db_connection
from models.user import UserModel


class UserRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db_connection)) -> None:
        self.db = db

    def list(self, firstname: Optional[str], lastname: Optional[str], email: Optional[str],
             is_active: Optional[bool], limit: Optional[int], offset: Optional[int]) -> List[UserModel]:
        query = self.db.query(UserModel)

        if firstname and lastname and is_active:
            query = query.filter_by(firstname=firstname, lastname=lastname)
        elif email and is_active:
            query = query.filter_by(email=email)
        elif not is_active:
            query = query.filter_by(is_active=False)

        return query.offset(offset).limit(limit).all()

    def get(self, user: UserModel) -> UserModel:
        return self.db.get(user, user.id, options=[lazyload(UserModel.activities)])

    def get_by_email(self, email: str) -> UserModel:
        return self.db.query(UserModel).filter_by(email=email).first()

    def create(self, user: UserModel) -> UserModel:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, id: int, user: UserModel) -> UserModel:
        user.id = id
        self.db.merge(user)
        self.db.commit()
        return user

    # is_active=false
    def delete(self, user: UserModel) -> None:
        user.is_active = False
        self.db.commit()
        self.db.refresh(user)
        # self.db.delete(user)
        # self.db.commit()
        # self.db.flush()