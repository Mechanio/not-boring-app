import os
from dotenv import load_dotenv


load_dotenv()


class Config(object):
    SQLALCHEMY_DATABASE_URL = os.environ.get('SQLALCHEMY_DATABASE_URI') or os.getenv("DB_STRING")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']