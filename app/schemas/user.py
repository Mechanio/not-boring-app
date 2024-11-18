from pydantic import BaseModel

from .activities import Activities
from .activity_lists import ActivityLists


class UserBase(BaseModel):
    firstname: str
    lastname: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    activities: list[Activities] = []
    activity_lists: list[ActivityLists] = []
