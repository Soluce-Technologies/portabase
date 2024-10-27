import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import BaseModel, engine
from middleware.db_connection import DatabaseSessionMiddleware

from routes.main import api_router
from fastapi.middleware.cors import CORSMiddleware

from settings import config


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initialising database...")
    BaseModel.metadata.create_all(bind=engine)
    print("Database initialised!")
    yield
    print("App shutdown!")


middlewares = []

app = FastAPI(lifespan=lifespan, middleware=middlewares)


app.add_middleware(DatabaseSessionMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=config.ALLOWED_HOSTS)

app.include_router(api_router)
