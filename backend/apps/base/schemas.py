from datetime import datetime

from pydantic import BaseModel as BaseSchema


class Schema(BaseSchema):
    id: int | None = None
    created_at: datetime | None = None
