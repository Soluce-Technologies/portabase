from sqlalchemy import asc, select
from sqlalchemy.ext.asyncio import AsyncSession
from .models import User


#
# def get_user(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.id == user_id).first()

#
# def get_users(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.User).order_by(asc(models.User.id)).offset(skip).limit(limit).all()


async def get_users(session: AsyncSession, skip: int = 0, limit: int = 100):
    query = select(User).order_by(asc(User.id)).offset(skip).limit(limit)
    result = await session.execute(query)
    users = result.scalars().all()
    return users

#
# def get_user_by_email(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()


# def create_user(db: Session, user: schemas.UserCreate):
#     fake_hashed_password = services.get_password_hash(user.password)
#     db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

#
# def create_admin_user(db: Session, user: schemas.AdminUserCreate):
#     fake_hashed_password = services.get_password_hash(user.password)
#     db_user = models.User(email=user.email, hashed_password=fake_hashed_password, role=user.role)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user
