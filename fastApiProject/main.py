from fastapi import FastAPI

from database.database import db, base, Session
from routers import users


base.metadata.create_all(db)
app = FastAPI()
app.include_router(users.router)



@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
