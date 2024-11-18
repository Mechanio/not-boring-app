from typing import List, Optional

from fastapi import Depends

from models.activity_lists import ActivityListsModel
from repositories.activity_lists import ActivityListsRepository
from schemas.activities import Activities, ActivitiesCreate, ActivitiesBase
from schemas.activity_lists import ActivityLists, ActivityListsBase


class ActivityListsService:
    activityListsRepository: ActivityListsRepository

    def __init__(self, activityListsRepository: ActivityListsRepository = Depends()) -> None:
        self.activityListsRepository = activityListsRepository

    def create(self, activity_list_body: ActivityListsBase, user_id: int)-> ActivityListsModel:
        return self.activityListsRepository.create(ActivityListsModel(name=activity_list_body.name, user_id=user_id))

    def get(self, activity_list_id: int) -> ActivityListsModel:
        return self.activityListsRepository.get(activity_list_id)