from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.models import Producto


class Categoria(SQLModel, table=True):
    __tablename__ = "categoria"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: str | None = Field(default=None)
    activo: bool = Field(default=True, nullable=False)

    productos: list["Producto"] = Relationship(back_populates="categoria")
