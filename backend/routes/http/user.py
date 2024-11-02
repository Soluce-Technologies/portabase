from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi_users import FastAPIUsers
from fastapi_users.schemas import BaseUser
from sqlalchemy import asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from apps.users import crud
from apps.users.models import User
from apps.users.schemas import UserRead, UserUpdate
from apps.users.services import fastapi_users, current_active_user
from database import get_user_db, get_async_session
from middleware.db_connection import get_db
from sqlalchemy.future import select

# router = APIRouter()
router = APIRouter(prefix="/users", tags=["users"])

current_superuser = fastapi_users.current_user(active=True, superuser=True)


# @router.get("/list", response_model=list[BaseUser])
# async def list_users(db: Session = Depends(get_db), user: User = Depends(current_superuser)):
#     db_users = crud.get_users(db)
#     return db_users


@router.get("/list", response_model=List[BaseUser])
async def get_users(skip: int = 0, limit: int = 10, session: AsyncSession = Depends(get_async_session)):
    users = await crud.get_users(session=session, skip=skip, limit=limit)

    return users


router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate)
)
