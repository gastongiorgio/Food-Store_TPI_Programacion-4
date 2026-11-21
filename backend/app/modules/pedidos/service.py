from datetime import UTC, datetime
from typing import ClassVar

from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork


class PedidoNoEncontrado(Exception):
    pass


class ProductoNoEncontrado(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class ProductoRepetido(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class TransicionInvalida(Exception):
    pass


class PedidoService:

    TRANSICIONES: ClassVar[dict[str, set[str]]] = {
        "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
        "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
        "ENTREGADO": set(),
        "CANCELADO": set(),
    }

    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def _obtener(
        self,
        uow: PedidoUnitOfWork,
        pedido_id: int
    ) -> Pedido:

        pedido = uow.pedidos.get_by_id(pedido_id)

        if pedido is None:
            raise PedidoNoEncontrado("Pedido no encontrado.")

        return pedido

    def _respuesta(self, pedido: Pedido) -> PedidoRead:
        return PedidoRead.model_validate(pedido)

    def _verificar_permiso(
        self,
        pedido: Pedido,
        usuario_id: int,
        rol: str
    ) -> None:

        if rol != "admin" and pedido.usuario_id != usuario_id:
            raise PedidoAjeno("No tenés permiso para ver este pedido.")

    def listar(
        self,
        usuario_id: int,
        rol: str,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None
    ) -> PedidosPaginados:

        with self.uow as uow:
            filtro_usuario = None if rol == "admin" else usuario_id

            total, pedidos = uow.pedidos.list_by_usuario(
                usuario_id=filtro_usuario,
                skip=skip,
                limit=limit,
                estado=estado
            )

            return PedidosPaginados(
                total=total,
                items=[self._respuesta(pedido) for pedido in pedidos]
            )

    def obtener(
        self,
        pedido_id: int,
        usuario_id: int,
        rol: str
    ) -> PedidoRead:

        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)
            self._verificar_permiso(pedido, usuario_id, rol)

            return self._respuesta(pedido)

    def crear(
        self,
        datos: PedidoCreate,
        usuario_id: int
    ) -> PedidoRead:

        with self.uow as uow:

            productos_vistos: set[int] = set()

            for item in datos.items:
                if item.producto_id in productos_vistos:
                    raise ProductoRepetido(f"El producto {item.producto_id} está repetido.")

                productos_vistos.add(item.producto_id)

            pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=datos.forma_pago,
                direccion_entrega=datos.direccion_entrega,
                notas=datos.notas,
                total=0.0
            )

            uow.pedidos.add(pedido)

            pedido_id = pedido.id

            if pedido_id is None:
                raise RuntimeError("El pedido no tiene un id asignado.")

            total = 0.0

            for item in datos.items:

                producto = uow.productos.get_by_id(item.producto_id)

                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(f"El producto {item.producto_id} no existe.")

                if not producto.disponible:
                    raise ProductoNoDisponible(f"El producto {item.producto_id} no está disponible.")

                if producto.stock < item.cantidad:
                    raise StockInsuficiente(f"Stock insuficiente para el producto {item.producto_id}.")

                producto.stock -= item.cantidad
                uow.productos.add(producto)

                subtotal = producto.precio_base * item.cantidad

                detalle = DetallePedido(
                    pedido_id=pedido_id,
                    producto_id=item.producto_id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal
                )

                uow.detalles.add(detalle)

                total += subtotal

            pedido.total = total
            uow.pedidos.add(pedido)

            return self._respuesta(pedido)

    def _reponer_stock(
        self,
        uow: PedidoUnitOfWork,
        pedido: Pedido
    ) -> None:

        for detalle in pedido.items:
            producto = uow.productos.get_by_id(detalle.producto_id)

            if producto is None:
                raise ProductoNoEncontrado(f"El producto {detalle.producto_id} no existe.")

            producto.stock += detalle.cantidad
            uow.productos.add(producto)

    def _cambiar_estado(
        self,
        uow: PedidoUnitOfWork,
        pedido: Pedido,
        nuevo_estado: str
    ) -> None:

        estados_permitidos = self.TRANSICIONES.get(pedido.estado, set())

        if nuevo_estado not in estados_permitidos:
            raise TransicionInvalida(f"No se puede pasar de {pedido.estado} a {nuevo_estado}.")

        if nuevo_estado == "CANCELADO":
            self._reponer_stock(uow, pedido)

        pedido.estado = nuevo_estado
        pedido.updated_at = datetime.now(UTC)

        uow.pedidos.add(pedido)

    def cambiar_estado(
        self,
        pedido_id: int,
        datos: CambioEstado
    ) -> PedidoRead:

        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)

            self._cambiar_estado(uow, pedido, datos.estado)

            return self._respuesta(pedido)

    def cancelar(
        self,
        pedido_id: int,
        usuario_id: int
    ) -> PedidoRead:

        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)

            if pedido.usuario_id != usuario_id:
                raise PedidoAjeno("Este pedido pertenece a otro usuario.")

            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida("Solo se pueden cancelar pedidos pendientes.")

            self._cambiar_estado(uow, pedido, "CANCELADO")

            return self._respuesta(pedido)

    def resumen(self) -> ResumenPedidos:

        with self.uow as uow:
            return ResumenPedidos(
                pendientes=uow.pedidos.count_by_estado("PENDIENTE"),
                en_preparacion=uow.pedidos.count_by_estado("EN_PREPARACION"),
                entregados=uow.pedidos.count_by_estado("ENTREGADO"),
                cancelados=uow.pedidos.count_by_estado("CANCELADO"),
                pedidos_hoy=uow.pedidos.count_hoy(),
                ingresos_entregados=uow.pedidos.ingresos_entregados(),
            )
