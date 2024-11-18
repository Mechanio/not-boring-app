import datetime
from typing import Optional

from pydantic import BaseModel


class ActivitiesBase(BaseModel):
    name: str
    one_time_only: bool
    repeat: str | None = None
    start: datetime.datetime
    activity_list_id: int
    # finish: datetime.datetime | None = None
    finish: Optional[datetime.datetime] = None


class Activities(ActivitiesBase):
    id: int
    user_id: int
    done: Optional[bool] =False

class ActivitiesCreate(ActivitiesBase):
    user_id: int

class ActivitiesPatch(BaseModel):
    done: Optional[bool] =False