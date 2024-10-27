from fastapi import Depends, APIRouter, Request
from sqlalchemy.orm import Session

from apps.users.roles import Permission
from apps.users.services import permission_required, get_current_user, get_current_active_user
from pydantic import BaseModel

from middleware.db_connection import get_db

router = APIRouter(prefix="/agents", tags=["agents"])


class Agent(BaseModel):
    name: str


# Example usage:
@router.post("/", dependencies=[Depends(get_current_active_user)])
@permission_required(Permission.CREATE)
async def create_agent(agent: Agent, request: Request, db: Session = Depends(get_db)):
    print(agent)
    return True
