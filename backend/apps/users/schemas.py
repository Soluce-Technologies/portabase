from apps.base.schemas import Schema


class UserBase(Schema):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class Token(Schema):
    access_token: str
    token_type: str


class TokenData(Schema):
    username: str | None = None


class UserInDB(User):
    hashed_password: str
