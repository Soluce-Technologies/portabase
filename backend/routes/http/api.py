from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["api"])


@router.get("/")
async def root():
    return {"message": "Hello from backup agent!"}
