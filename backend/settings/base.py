from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import find_dotenv


class Settings(BaseSettings):
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    SMTP_PORT: int
    SMTP_SERVER: str
    SENDER_MAIL: str
    SENDER_PW: str
    HTTPS: bool = False
    DEBUG: bool = False
    ALLOWED_HOSTS: List[str]
    SECRET_KEY: str  # openssl rand -hex 32
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    STAGE: bool = False

    model_config = SettingsConfigDict(env_file=find_dotenv(), extra='allow')
