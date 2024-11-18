from pydantic import BaseModel


class ActivityListsBase(BaseModel):
    name: str

class ActivityLists(ActivityListsBase):
    id: int
    user_id: int