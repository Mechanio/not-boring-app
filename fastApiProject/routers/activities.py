from fastapi import APIRouter, Depends
from ..database.database import Session
from typing import Annotated

from .. import schemas
from ..models import ActivitiesModel
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


@router.patch("/api/activities/{item_id}", tags=["activities"], response_model=schemas.Activities)
def patch_activity(
        current_user: Annotated[schemas.User, Depends(get_current_user)],
        item_id: int, update: schemas.DoneUpdate, db: Session = Depends(get_db)
):
    activity = ActivitiesModel.find_by_id(db, item_id)
    activity.done = update.done
    activity.save_to_db(db)
    return activity
