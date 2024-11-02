from fastapi import APIRouter
from routes.http import welcome, user, agent, auth

api_router = APIRouter(prefix="/api", tags=["api"])
api_router.include_router(welcome.router)
api_router.include_router(user.router)
api_router.include_router(auth.router)
# api_router.include_router(agent.router)

