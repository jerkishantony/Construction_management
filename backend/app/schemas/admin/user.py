from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str

    full_name: str
    email: str
    phone: str
    company_name: str

    role: str
    plan: str


class UserUpdate(BaseModel):
    username: str
    full_name: str
    email: str
    phone: str
    company_name: str

    role: str
    plan: str
    is_active: bool


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserLogin(BaseModel):
    username: str
    password: str