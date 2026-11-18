from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import get_current_active_user
from app.modules.auth.schemas import AuthMessage
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED
)
def register(
    datos: UserCreate,
    service: Annotated[AuthService, Depends(get_auth_service)]
) -> UserPublic:

    return service.register(datos)


@router.post("/token", response_model=AuthMessage)
def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: Annotated[AuthService, Depends(get_auth_service)]
) -> AuthMessage:

    token = service.authenticate(
        form_data.username,
        form_data.password
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False
    )

    return AuthMessage(message="Login exitoso")


@router.post("/logout", response_model=AuthMessage)
def logout(response: Response) -> AuthMessage:
    response.delete_cookie(key="access_token")

    return AuthMessage(message="Sesión cerrada")


@router.get("/me", response_model=UserPublic)
def me(
    current_user: Annotated[UserPublic, Depends(get_current_active_user)]
) -> UserPublic:
    
    return current_user