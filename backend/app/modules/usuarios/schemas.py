from datetime import datetime

from pydantic import field_validator
from sqlmodel import Field, SQLModel


class UserCreate(SQLModel):
    username: str
    full_name: str
    email: str
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validar_password(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("La contraseña no puede superar los 72 bytes")
        return value


class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: str
    role: str
    disabled: bool
    created_at: datetime
