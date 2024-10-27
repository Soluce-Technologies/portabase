from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from database import SessionLocal


class DatabaseSessionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = Response("Internal server error", status_code=500)
        try:
            request.state.db = SessionLocal()
            response = await call_next(request)
        finally:
            request.state.db.close()
        return response


def get_db(request: Request):
    print(request)
    return request.state.db
