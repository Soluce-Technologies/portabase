from fastapi import APIRouter
from routes.http import api

api_router = APIRouter()
api_router.include_router(api.router)

