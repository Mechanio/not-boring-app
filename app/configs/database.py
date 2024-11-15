from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from .environment import get_environment_variables


env = get_environment_variables()

engine = create_engine(env.DB_STRING, connect_args={"check_same_thread": False}, future=True)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_connection():
    # db = scoped_session(Session())
    db = Session()
    try:
        yield db
    finally:
        db.close()
