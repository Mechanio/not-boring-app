from typing import List, Optional, Type

from fastapi import Depends
from sqlalchemy.orm import Session, lazyload

from configs.database import get_db_connection
from models.activity_lists import ActivityListsModel


class ActivityListsRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db_connection)) -> None:
        self.db = db


    def create(self, activity_list: ActivityListsModel) -> ActivityListsModel:
        self.db.add(activity_list)
        self.db.commit()
        self.db.refresh(activity_list)
        return activity_list

    def get(self, list_id: int) -> ActivityListsModel:
        return self.db.query(ActivityListsModel).get(list_id)