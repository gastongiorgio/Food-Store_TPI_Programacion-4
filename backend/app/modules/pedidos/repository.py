from datetime import UTC, datetime, timedelta

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):

    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int | None = None,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[int, list[Pedido]]:

        query = select(Pedido)

        if usuario_id is not None:
            query = query.where(col(Pedido.usuario_id) == usuario_id)

        if estado is not None:
            query = query.where(col(Pedido.estado) == estado)

        total = self.session.exec(
            select(func.count()).select_from(query.subquery())
        ).one()

        pedidos = self.session.exec(
            query
            .order_by(col(Pedido.id).desc())
            .offset(skip)
            .limit(limit)
        ).all()

        return total, list(pedidos)

    def count_by_estado(self, estado: str) -> int:
        return self.session.exec(
            select(func.count())
            .select_from(Pedido)
            .where(col(Pedido.estado) == estado)
        ).one()

    def count_hoy(self) -> int:
        inicio = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
        fin = inicio + timedelta(days=1)

        return self.session.exec(
            select(func.count())
            .select_from(Pedido)
            .where(
                col(Pedido.created_at) >= inicio,
                col(Pedido.created_at) < fin,
            )
        ).one()

    def ingresos_entregados(self) -> float:
        total = self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0.0))
            .where(col(Pedido.estado) == "ENTREGADO")
        ).one()

        return float(total)


class DetallePedidoRepository(BaseRepository[DetallePedido]):

    def __init__(self, session: Session) -> None:
        super().__init__(session, DetallePedido)

    def get_by_pedido(self, pedido_id: int) -> list[DetallePedido]:
        return list(
            self.session.exec(
                select(DetallePedido)
                .where(col(DetallePedido.pedido_id) == pedido_id)
                .order_by(col(DetallePedido.producto_id))
            ).all()
        )
