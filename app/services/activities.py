from typing import List, Optional

from fastapi import Depends

from models.activities import ActivitiesModel
from repositories.activities import ActivitiesRepository
from schemas.activities import Activities, ActivitiesCreate, ActivitiesBase


class ActivitiesService:
    activitiesRepository: ActivitiesRepository

    def __init__(self, activitiesRepository: ActivitiesRepository = Depends()) -> None:
        self.activitiesRepository = activitiesRepository

    def create(self, activity_body: ActivitiesBase, user_id: int)-> ActivitiesModel:
        return self.activitiesRepository.create(ActivitiesModel(name=activity_body.name, user_id=user_id,
                                                                one_time_only=activity_body.one_time_only, repeat=activity_body.repeat,
                                                                start=activity_body.start, finish=activity_body.finish))

    def delete(self, activity_id: int) -> None:
        return self.activitiesRepository.delete(ActivitiesModel(id=activity_id))

    def get(self, activity_id: int) -> ActivitiesModel:
        return self.activitiesRepository.get(ActivitiesModel(id=activity_id))

    def list(self, user_id: Optional[int], page_size: Optional[int] = 100,
             start_index: Optional[int] = 0) -> List[ActivitiesModel]:
        return self.activitiesRepository.list(user_id, page_size, start_index)

    def update_done_status(self, activity_id: int, done: bool) -> ActivitiesModel:
        activity = self.activitiesRepository.get(activity_id)
        activity.done = done
        return self.activitiesRepository.update(activity_id, activity)
