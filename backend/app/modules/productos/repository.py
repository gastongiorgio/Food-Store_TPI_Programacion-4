from sqlalchemy.sql.elements import ColumnElement
from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[int, list[Producto]]:

        filtros: list[ColumnElement[bool]] = [
            col(Producto.activo).is_(True)
        ]

        if search:
            filtros.append(col(Producto.nombre).ilike(f"%{search}%"))

        if categoria_id is not None:
            filtros.append(col(Producto.categoria_id) == categoria_id)

        if disponible is not None:
            filtros.append(col(Producto.disponible) == disponible)

        count_query = (
            select(func.count())
            .select_from(Producto)
            .where(*filtros)
        )

        total = self.session.exec(count_query).one()

        query = (
            select(Producto)
            .where(*filtros)
            .order_by(col(Producto.id))
            .offset(skip)
            .limit(limit)
        )

        productos = self.session.exec(query).all()

        return total, list(productos)
