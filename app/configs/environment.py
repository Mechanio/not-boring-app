from functools import lru_cache
import os

from pydantic_settings import BaseSettings


@lru_cache
def get_env_filename():
    runtime_env = os.getenv("ENV")
    return f".env.{runtime_env}" if runtime_env else ".env"


class EnvironmentSettings(BaseSettings):
    DB_STRING: str
    JWT_SECRET_KEY: str
    JWT_BLACKLIST_ENABLED: bool
    # JWT_BLACKLIST_TOKEN_CHECKS: list

    class Config:
        env_file = get_env_filename()
        env_file_encoding = "utf-8"


@lru_cache
def get_environment_variables():
    return EnvironmentSettings()