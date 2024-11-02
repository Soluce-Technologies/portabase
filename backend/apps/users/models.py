from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import DeclarativeBase
from apps.base.models import Model
from apps.users.roles import Role


#
# class User(Model):
#     __tablename__ = 'users'
#
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
#     is_active = Column(Boolean, default=True)
#     role = Column(Enum(Role), default=Role.USER)  # Add a role attribute
#     # role = Column(String)  # Ensure role is defined


class Base(DeclarativeBase):
    pass


class User(SQLAlchemyBaseUserTableUUID, Base):
    pass
