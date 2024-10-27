from fastapi import APIRouter

router = APIRouter(prefix="/welcome", tags=["api"])


@router.get("/")
async def root():
    return {"message": "Hello from portabase!"}
