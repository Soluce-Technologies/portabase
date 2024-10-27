from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from settings import config

POSTGRES_SERVER = config.POSTGRES_SERVER
POSTGRES_USER = config.POSTGRES_USER
POSTGRES_PASSWORD = config.POSTGRES_PASSWORD
POSTGRES_DB = config.POSTGRES_DB

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

BaseModel = declarative_base()
