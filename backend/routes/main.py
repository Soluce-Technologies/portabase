from fastapi import APIRouter
from routes.http import welcome, user

api_router = APIRouter(prefix="/api", tags=["api"])
api_router.include_router(welcome.router)
api_router.include_router(user.router)

