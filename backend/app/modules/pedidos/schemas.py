from datetime import datetime

from pydantic import field_validator
from sqlmodel import Field, SQLModel


class ItemPedidoCreate(SQLModel):
    producto_id: int
    cantidad: int = Field(ge=1)


class DetallePedidoRead(SQLModel):
    producto_id: int
    nombre_producto: str
    precio_unitario: float
    cantidad: int
    subtotal: float


class PedidoCreate(SQLModel):
    items: list[ItemPedidoCreate] = Field(min_length=1)
    forma_pago: str
    direccion_entrega: str = Field(min_length=5, max_length=200)
    notas: str | None = None

    @field_validator("forma_pago")
    @classmethod
    def validar_forma_pago(cls, forma_pago: str) -> str:
        formas_permitidas = {"EFECTIVO", "TRANSFERENCIA"}

        if forma_pago not in formas_permitidas:
            raise ValueError("La forma de pago debe ser EFECTIVO o TRANSFERENCIA.")

        return forma_pago


class CambioEstado(SQLModel):
    estado: str

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, estado: str) -> str:
        estados_permitidos = {
            "PENDIENTE",
            "EN_PREPARACION",
            "ENTREGADO",
            "CANCELADO"
        }

        if estado not in estados_permitidos:
            raise ValueError(
                "El estado debe ser PENDIENTE, EN_PREPARACION, ENTREGADO o CANCELADO.")

        return estado


class PedidoRead(SQLModel):
    id: int
    usuario_id: int
    estado: str
    forma_pago: str
    direccion_entrega: str
    notas: str | None
    total: float
    created_at: datetime
    updated_at: datetime
    items: list[DetallePedidoRead]


class PedidosPaginados(SQLModel):
    total: int
    items: list[PedidoRead]


class ResumenPedidos(SQLModel):
    pendientes: int
    en_preparacion: int
    entregados: int
    cancelados: int
    pedidos_hoy: int
    ingresos_entregados: float
