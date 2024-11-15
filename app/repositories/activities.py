from typing import List, Optional

from fastapi import Depends
from sqlalchemy.orm import Session, lazyload

from configs.database import get_db_connection
from models.activities import ActivitiesModel


class ActivitiesRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db_connection)) -> None:
        self.db = db

    def list(self, user_id: Optional[int], limit: Optional[int], offset: Optional[int]) -> List[ActivitiesModel]:
        query = self.db.query(ActivitiesModel)

        if user_id:
            query = query.filter_by(user_id=user_id)

        return query.offset(offset).limit(limit).all()

    # def get(self, activity: ActivitiesModel) -> ActivitiesModel:
    #     return self.db.get(activity, activity.id, options=[lazyload(ActivitiesModel.user)])
    def get(self, activity_id: int) -> ActivitiesModel:
        return self.db.query(ActivitiesModel).filter_by(id=activity_id).first()


    def create(self, activity: ActivitiesModel) -> ActivitiesModel:
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(activity)
        return activity

    def update(self, id: int, activity: ActivitiesModel) -> ActivitiesModel:
        activity.id = id
        self.db.merge(activity)
        self.db.commit()
        return activity

    def delete(self, activity: ActivitiesModel) -> None:
        self.db.delete(activity)
        self.db.commit()
        self.db.flush()