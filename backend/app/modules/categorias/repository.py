from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.categorias.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):

    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        query = select(Categoria).where(
            func.lower(col(Categoria.nombre)) == nombre.strip().lower()
        )
        return self.session.exec(query).first()

    def listar_activas(self) -> list[Categoria]:
        query = (
            select(Categoria)
            .where(col(Categoria.activo).is_(True))
            .order_by(col(Categoria.id))
        )
        return list(self.session.exec(query).all())
