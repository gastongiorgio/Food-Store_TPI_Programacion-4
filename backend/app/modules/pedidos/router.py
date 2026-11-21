from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schemas import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoNoEncontrado,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.models import Usuario

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


def obtener_usuario_id(usuario: Usuario) -> int:
    if usuario.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no autenticado."
        )

    return usuario.id


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED
)
def crear(
    datos: PedidoCreate,
    usuario: Annotated[Usuario, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)]
) -> PedidoRead:

    try:
        return service.crear(
            datos=datos,
            usuario_id=obtener_usuario_id(usuario)
        )
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error
    except (
        ProductoNoDisponible,
        StockInsuficiente,
        ProductoRepetido
    ) as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        ) from error


@router.get("", response_model=PedidosPaginados)
def listar(
    usuario: Annotated[Usuario, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    estado: str | None = Query(default=None)
) -> PedidosPaginados:

    return service.listar(
        usuario_id=obtener_usuario_id(usuario),
        rol=usuario.role,
        skip=skip,
        limit=limit,
        estado=estado
    )


@router.get(
    "/resumen",
    response_model=ResumenPedidos,
    dependencies=[Depends(require_role(["admin"]))]
)
def resumen(
    service: Annotated[PedidoService, Depends(get_pedido_service)]
) -> ResumenPedidos:

    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener(
    pedido_id: int,
    usuario: Annotated[Usuario, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)]
) -> PedidoRead:

    try:
        return service.obtener(
            pedido_id=pedido_id,
            usuario_id=obtener_usuario_id(usuario),
            rol=usuario.role
        )
    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error
    except PedidoAjeno as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(error)
        ) from error


@router.patch(
    "/{pedido_id}/estado",
    response_model=PedidoRead,
    dependencies=[Depends(require_role(["admin"]))]
)
def cambiar_estado(
    pedido_id: int,
    datos: CambioEstado,
    service: Annotated[PedidoService, Depends(get_pedido_service)]
) -> PedidoRead:

    try:
        return service.cambiar_estado(pedido_id, datos)
    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error
    except TransicionInvalida as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        ) from error
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error


@router.patch(
    "/{pedido_id}/cancelar",
    response_model=PedidoRead
)
def cancelar(
    pedido_id: int,
    usuario: Annotated[Usuario, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)]
) -> PedidoRead:

    try:
        return service.cancelar(
            pedido_id=pedido_id,
            usuario_id=obtener_usuario_id(usuario)
        )
    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error
    except PedidoAjeno as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(error)
        ) from error
    except TransicionInvalida as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        ) from error
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error
