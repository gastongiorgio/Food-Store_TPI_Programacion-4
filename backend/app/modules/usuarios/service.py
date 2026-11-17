from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from fastapi import HTTPException


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def set_disabled(
        self,
        usuario_id: int,
        disabled: bool,
        admin_id: int
    ) -> UserPublic:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(usuario_id)

            if usuario is None:
                raise HTTPException(
                    status_code=404,
                    detail="Usuario no encontrado"
                )

            if disabled and usuario_id == admin_id:
                raise HTTPException(
                    status_code=400,
                    detail="No podés desactivar tu propia cuenta"
                )

            usuario.disabled = disabled
            return UserPublic.model_validate(usuario)


    def listar_usuarios(self) -> list[UserPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.list_all()
            return [
                UserPublic.model_validate(usuario)
                for usuario in usuarios
            ]
