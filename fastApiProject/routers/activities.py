from fastapi import APIRouter, Depends, HTTPException
from ..database.database import Session
from typing import Annotated

from .. import schemas
from ..models import UserModel, ActivitiesModel
from .auth import get_current_user

router = APIRouter()


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


@router.get("/api/activities", tags=["activities"], response_model=list[schemas.Activities])
async def get_current_user_activities(
    current_user: Annotated[schemas.User, Depends(get_current_user)],
):
    return current_user.activities


@router.post("/api/activities/", tags=["activities"], response_model=schemas.Activities)
def create_activity(
        current_user: Annotated[schemas.User, Depends(get_current_user)],
        activity: schemas.ActivitiesCreate, db: Session = Depends(get_db)
):
    activity = ActivitiesModel(name=activity.name, user_id=current_user.id, one_time_only=activity.one_time_only,
                               repeat=activity.repeat, start=activity.start, finish=activity.finish)
    activity.save_to_db(db)
    return activity



# @router.get("/api/users/", tags=["users"], response_model=list[schemas.User])
# def get_users(db: Session = Depends(get_db)):
#     users = UserModel.return_all(db, 0, 10)
#     return users