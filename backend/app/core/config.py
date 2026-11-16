from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = Field(min_length=1)
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: Literal["HS256"] = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, gt=0)
    FRONTEND_ORIGIN: str = "http://localhost:5173"


settings = Settings()
