from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork



class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def register(self, datos: UserCreate) -> UserPublic:

        with self.uow as uow:
            user = uow.usuarios.get_by_username(datos.username)
            if user is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="El nombre de usuario ya existe",
                )

            user = uow.usuarios.get_by_email(datos.email)
            if user is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, detail="El email ya existe"
                )

            nuevo_usuario = Usuario(
                username=datos.username,
                full_name=datos.full_name,
                email=datos.email,
                hashed_password=hash_password(datos.password),
            )

            uow.usuarios.add(nuevo_usuario)

            return UserPublic.model_validate(nuevo_usuario)

        
    def authenticate(self, username: str, password: str) -> str:

        with self.uow as uow:
            user = uow.usuarios.get_by_username(username)

            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas"
                )

            if not verify_password(password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas"
                )

            if user.disabled:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada"
                )

            token = create_access_token(
                data={
                    "sub": user.username,
                    "role": user.role
                }
            )

            return token


