from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from configs.environment import get_environment_variables
from routing.activity_lists import activity_lists_router
from routing.user import user_router
from routing.auth import auth_router
from routing.activities import activities_router
from models.base_model import init

# Application Environment Configuration
env = get_environment_variables()

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(activities_router)
app.include_router(auth_router)
app.include_router(activity_lists_router)

init()