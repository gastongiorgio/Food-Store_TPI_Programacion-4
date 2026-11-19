from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


@router.get(
    "",
    response_model=list[UserPublic],
    dependencies=[Depends(require_role(["admin"]))]
)
def listar_usuarios(
    service: Annotated[UsuarioService, Depends(get_usuario_service)]
) -> list[UserPublic]:

    return service.listar_usuarios()


@router.post(
    "/{usuario_id}/activar",
    response_model=UserPublic
)
def activar_usuario(
    usuario_id: int,
    admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)]
) -> UserPublic:

    return service.set_disabled(
        usuario_id=usuario_id,
        disabled=False,
        admin_id=admin.id
    )


@router.post(
    "/{usuario_id}/desactivar",
    response_model=UserPublic
)
def desactivar_usuario(
    usuario_id: int,
    admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)]
) -> UserPublic:

    return service.set_disabled(
        usuario_id=usuario_id,
        disabled=True,
        admin_id=admin.id
    )