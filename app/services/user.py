from typing import List, Optional

from fastapi import Depends

from schemas.activities  import Activities
from models.user import UserModel
from repositories.user import UserRepository
from schemas.user import UserCreate


class UserService:
    userRepository: UserRepository

    def __init__(self, userRepository: UserRepository = Depends()) -> None:
        self.userRepository = userRepository

    def create(self, user_body: UserCreate) -> UserModel:
        return self.userRepository.create(UserModel(firstname=user_body.firstname, lastname=user_body.lastname,
                                                    email=user_body.email, hashed_password=UserModel.generate_hash(user_body.password),
                                                    is_active=True))

    def delete(self, user_id: int) -> None:
        return self.userRepository.delete(UserModel(id=user_id))

    def get(self, user_id: int) -> UserModel:
        return self.userRepository.get(UserModel(id=user_id))

    def list(self, firstname: Optional[str] = None, lastname: Optional[str] = None,
             email: Optional[str] = None, is_active: Optional[bool] = True, page_size: Optional[int] = 100,
             start_index: Optional[int] = 0) -> List[UserModel]:
        return self.userRepository.list(firstname, lastname, email, is_active, page_size, start_index)

    # def update(self, user_id: int, user_body: User) -> UserModel:
    #     return self.userRepository.update(user_id, UserModel(name=user_body.name))

    # def get_activities_by_email(self, email: str) -> List[Activities]:
    #     return self.userRepository.get_by_email(email).activities