import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import create_db_and_tables
from middleware.create_user import create_user
from routes.main import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    await create_user("soluce.technologies@gmail.com", "12345678", True)

    yield


app = FastAPI(lifespan=lifespan)
app.include_router(api_router)
