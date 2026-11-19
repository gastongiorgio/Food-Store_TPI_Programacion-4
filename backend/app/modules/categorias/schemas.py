from pydantic import field_validator
from sqlmodel import Field, SQLModel


class CategoriaBase(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = None

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, nombre: object) -> object:
        if isinstance(nombre, str):
            return nombre.strip()

        return nombre


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = None

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, nombre: object) -> object:
        if nombre is None:
            raise ValueError("El nombre no puede ser nulo.")

        if isinstance(nombre, str):
            return nombre.strip()

        return nombre


class CategoriaRead(CategoriaBase):
    id: int
    activo: bool
