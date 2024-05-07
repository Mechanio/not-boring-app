from pydantic import BaseModel


class ActivitiesBase(BaseModel):
    name: str
    description: str | None = None
    start: str
    finish: str | None = None

class ActivitiesCreate(ActivitiesBase):
    pass


class Activities(ActivitiesBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


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

    class Config:
        orm_mode = True