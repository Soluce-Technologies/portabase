from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Request

from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from functools import wraps

from apps.users.crud import get_user_by_email
from apps.users.roles import Permission, role_permissions
from apps.users.schemas import TokenData, User, UserInDB
from middleware.db_connection import get_db
from settings import config

ALGORITHM = "HS256"

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(db, username: str, password: str):
    user = get_user_by_email(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(token)
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[ALGORITHM])
        print("payload", payload)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    print(token_data.username)
    user = get_user_by_email(db, email=token_data.username)
    print(user)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
        current_user: Annotated[User, Depends(get_current_user)]
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def permission_required(permission: Permission):
    def decorator(func):
        @wraps(func)
        async def decorated_function(*args, **kwargs):
            print("test", kwargs)
            request: Request = kwargs.get("request")
            db: Session = kwargs.get("db")
            if not request:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Missing request object",
                )

            # Get the authorization header
            authorization_header = request.headers.get("Authorization")

            # Extract the token from the authorization header
            if not authorization_header:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing authorization header",
                )

            # Assuming the token is in the format "Bearer <token>"
            token = authorization_header.split(" ")[1]

            current_user = await get_current_user(token=token, db=db)
            # Check if the user has the required permission
            if permission not in role_permissions[current_user.role]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have the required permission",
                )
            # Call the decorated function with the original arguments
            return await func(*args, **kwargs)

        return decorated_function

    return decorator
