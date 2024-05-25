from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.database import db, base
from .routers import users, auth, activities


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

base.metadata.create_all(db)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(activities.router)
