from typing import List, Optional, Annotated

from fastapi import APIRouter, Depends, status

from schemas.activities import Activities, ActivitiesBase, ActivitiesPatch
from services.activities import ActivitiesService
from services.auth import AuthService, oauth2_scheme

activities_router = APIRouter(prefix="/api/activities", tags=["activities"])


@activities_router.get("/me", response_model=List[Activities])

async def get_current_user_activities(token: Annotated[str, Depends(oauth2_scheme)], authService: AuthService = Depends()):
    cur_user = await authService.get_current_user(token=token)
    return cur_user.activities


@activities_router.get("/", response_model=List[Activities])
def index(user_id: Optional[int] = None, page_size: Optional[int] = 100,
          start_index: Optional[int] = 0, activitiesService: ActivitiesService = Depends()):
    return [activity.normalize() for activity in activitiesService.list(user_id, page_size, start_index)]


# @activities_router.get("/{id}", response_model=AuthorSchema)
# def get(id: int, authorService: AuthorService = Depends()):
#     return authorService.get(id).normalize()


@activities_router.post("/", response_model=ActivitiesBase, status_code=status.HTTP_201_CREATED)
async def create(activity: ActivitiesBase, token: Annotated[str, Depends(oauth2_scheme)], authService: AuthService = Depends(),
                 activitiesService: ActivitiesService = Depends()):
    cur_user = await authService.get_current_user(token=token)
    return activitiesService.create(activity, cur_user.id).normalize()


@activities_router.patch("/{activity_id}", response_model=Activities)
async def patch_activity(activity_id: int, activity: ActivitiesPatch, token: Annotated[str, Depends(oauth2_scheme)],
                         authService: AuthService = Depends(), activitiesService: ActivitiesService = Depends()):
    cur_user = await authService.get_current_user(token=token)
    return activitiesService.update_done_status(activity_id, activity.done)


# @activities_router.patch("/{id}", response_model=AuthorSchema)
# def update(id: int, author: AuthorPostRequestSchema, authorService: AuthorService = Depends()):
#     return authorService.update(id, author).normalize()


# @activities_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete(id: int, authorService: AuthorService = Depends()):
#     return authorService.delete(id)


# @activities_router.get("/{id}/books/", response_model=List[BookSchema])
# def get_books(id: int, authorService: AuthorService = Depends()):
#     return [book.normalize() for book in authorService.get_books(id)]