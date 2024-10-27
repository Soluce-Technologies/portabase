from sqlalchemy import Column, Boolean, String, Float
from sqlalchemy.orm import relationship

from apps.base.models import Model


class User(Model):
    __tablename__ = 'users'

    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

