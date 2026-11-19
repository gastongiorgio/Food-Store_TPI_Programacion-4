from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)


def session_factory() -> Session:
    return Session(engine)


def create_all_tables() -> None:
    from importlib import import_module

    modelos = (
        "app.modules.usuarios.models",
        "app.modules.categorias.models",
        "app.modules.productos.models",
        "app.modules.pedidos.models",
    )

    for modulo in modelos:
        import_module(modulo)

    SQLModel.metadata.create_all(engine)
