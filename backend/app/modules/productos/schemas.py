from pydantic import Field, field_validator
from sqlmodel import SQLModel

from app.modules.categorias.schemas import CategoriaRead


class ProductoBase(SQLModel):
    nombre: str = Field(min_length=1)
    descripcion: str | None = None
    precio_base: float = Field(ge=0, allow_inf_nan=False)
    imagen_url: str | None = None
    stock: int = Field(default=0, ge=0)
    disponible: bool = True
    categoria_id: int

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, nombre: object) -> object:
        if isinstance(nombre, str):
            return nombre.strip()

        return nombre


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=1)
    descripcion: str | None = None
    precio_base: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    imagen_url: str | None = None
    stock: int | None = Field(default=None, ge=0)
    disponible: bool | None = None
    categoria_id: int | None = None

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, nombre: object) -> object:
        if nombre is None:
            raise ValueError("El nombre no puede ser nulo.")

        if isinstance(nombre, str):
            return nombre.strip()

        return nombre

    @field_validator(
        "precio_base", "stock", "disponible", "categoria_id",
        mode="before"
    )
    @classmethod
    def validar_no_nulo(cls, valor: object) -> object:
        if valor is None:
            raise ValueError("El campo no puede ser nulo.")
        return valor


class ProductoRead(ProductoBase):
    id: int
    activo: bool
    categoria: CategoriaRead


class ProductoStockUpdate(SQLModel):
    stock: int = Field(ge=0)
    disponible: bool


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
