import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy.orm import Session
from starlette.middleware.trustedhost import TrustedHostMiddleware

from apps.users.roles import Role
from apps.users.schemas import UserCreate, User, AdminUserCreate
from database import BaseModel, engine, SessionLocal
from middleware.db_connection import DatabaseSessionMiddleware
from routes.main import api_router
from settings import config


def init_default_users(db: Session):
    from apps.users import crud
    print("Initializing default users...")
    if not crud.get_user_by_email(db, "admin@portabase.com"):
        print("Creating admin user...")
        user = AdminUserCreate(email="admin@portabase.com", password="password", role=Role.ADMIN)
        crud.create_admin_user(db, user)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initialising database...")
    BaseModel.metadata.create_all(bind=engine)
    print("Database initialised!")
    # Initialize default users
    db = SessionLocal()
    try:
        init_default_users(db)
    finally:
        db.close()

    yield
    print("App shutdown!")


middlewares = []

app = FastAPI(lifespan=lifespan, middleware=middlewares)

app.add_middleware(DatabaseSessionMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=config.ALLOWED_HOSTS)

app.include_router(api_router)

