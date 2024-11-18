from typing import List, Optional, Annotated

from fastapi import APIRouter, Depends, status

from schemas.activities import Activities, ActivitiesBase, ActivitiesPatch
from schemas.activity_lists import ActivityLists, ActivityListsBase
from services.activity_lists import ActivityListsService
from services.auth import AuthService, oauth2_scheme

activity_lists_router = APIRouter(prefix="/api/activity_lists", tags=["activity_lists"])

@activity_lists_router.post("/", response_model=ActivityLists, status_code=status.HTTP_201_CREATED)
async def create(activity_list: ActivityListsBase, token: Annotated[str, Depends(oauth2_scheme)], authService: AuthService = Depends(),
                 activityListsService: ActivityListsService = Depends()):
    cur_user = await authService.get_current_user(token=token)
    return activityListsService.create(activity_list, cur_user.id).normalize()

@activity_lists_router.get("/{id}", response_model=List[Activities])
def get_activities(id: int, activityListsService: ActivityListsService = Depends()):
    return activityListsService.get(id).activities
    # return [activity for activity in activityListsService.get(id)]