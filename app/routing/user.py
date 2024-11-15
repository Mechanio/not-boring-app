from typing import List, Optional, Annotated

from fastapi import APIRouter, Depends, status

from schemas.user import User, UserCreate
from services.user import UserService
from services.auth import AuthService, oauth2_scheme

user_router = APIRouter(prefix="/api/user", tags=["user"])


@user_router.get("/me", tags=["user"], response_model=User)
async def read_users_me(token: Annotated[str, Depends(oauth2_scheme)], authService: AuthService = Depends()):
    return await authService.get_current_user(token=token)

@user_router.get("/", tags=["user"], response_model=List[User])
def index(firstname: Optional[str] = None, lastname: Optional[str] = None,
          email: Optional[str] = None, is_active: Optional[bool] = True, page_size: Optional[int] = 100,
          start_index: Optional[int] = 0, userService: UserService = Depends()):
    return [user.normalize() for user in userService.list(firstname, lastname, email, is_active, page_size, start_index)]


# @user_router.get("/{id}", response_model=AuthorSchema)
# def get(id: int, authorService: AuthorService = Depends()):
#     return authorService.get(id).normalize()


@user_router.post("/", tags=["user"], response_model=User, status_code=status.HTTP_201_CREATED)
def create(user: UserCreate, userService: UserService = Depends()):
    return userService.create(user).normalize()


# @user_router.patch("/{id}", response_model=AuthorSchema)
# def update(id: int, author: AuthorPostRequestSchema, authorService: AuthorService = Depends()):
#     return authorService.update(id, author).normalize()


# @user_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete(id: int, authorService: AuthorService = Depends()):
#     return authorService.delete(id)





# @user_router.get("/me", response_model=List[Activities])
# async def get_current_user_activities(token: Annotated[str, Depends(oauth2_scheme)], authService: AuthService = Depends()):
#     result = await authService.get_current_user(token=token)
#     print(f"RESULT: {[activity.normalize() for activity in result['activities']]}")
#
#     return [activity.normalize() for activity in result['activities']]