from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import Config


db = create_engine(Config.SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
Session = sessionmaker(bind=db)
# Session = sessionmaker(autocommit=False, autoflush=False, bind=db)


base = declarative_base()