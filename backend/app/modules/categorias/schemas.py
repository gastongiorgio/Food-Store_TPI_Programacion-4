from pydantic import field_validator
from sqlmodel import Field, SQLModel


class CategoriaBase(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = None

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, nombre: str | None) -> str:
        if nombre is None:
            raise ValueError("El nombre no puede ser nulo.")

        return nombre.strip()


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(CategoriaBase):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = None


class CategoriaRead(CategoriaBase):
    id: int
    activo: bool