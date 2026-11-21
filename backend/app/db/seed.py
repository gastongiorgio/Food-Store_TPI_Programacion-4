from sqlmodel import col, select

from app.core.database import create_all_tables
from app.core.security import hash_password
from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.models import Categoria
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario


def seed() -> None:
    create_all_tables()

    with UnitOfWork() as uow:
        session = uow.session

        # Crear el administrador si todavía no existe
        admin = session.exec(
            select(Usuario).where(col(Usuario.username) == "admin")
        ).first()

        if admin is None:
            admin = Usuario(
                username="admin",
                full_name="Administrador Food Store",
                email="admin@foodstore.test",
                hashed_password=hash_password("Admin1234!"),
                role="admin",
                disabled=False
            )
            session.add(admin)

        elif admin.role != "admin":
            raise ValueError("Ya existe un usuario llamado admin sin rol de administrador.")

        # Categorías iniciales
        categorias = [
            ("Hamburguesas", "Hamburguesas y combos"),
            ("Pizzas", "Pizzas de diferentes variedades"),
            ("Bebidas", "Bebidas frías")
        ]

        categoria_repo = CategoriaRepository(session)
        categoria_ids: dict[str, int] = {}

        for nombre, descripcion in categorias:
            categoria = categoria_repo.get_by_nombre(nombre)

            if categoria is None:
                categoria = Categoria(
                    nombre=nombre,
                    descripcion=descripcion
                )
                session.add(categoria)
                session.flush()

            if categoria.id is None:
                raise RuntimeError(f"La categoría {nombre} no tiene un id asignado.")

            categoria_ids[nombre] = categoria.id

        # Productos iniciales
        productos = [
            (
                "Hamburguesas",
                "Hamburguesa clásica",
                "Hamburguesa con lechuga y tomate",
                9000.0,
                20
            ),
            (
                "Hamburguesas",
                "Hamburguesa con queso",
                "Hamburguesa con queso cheddar",
                10500.0,
                15
            ),
            (
                "Hamburguesas",
                "Hamburguesa doble",
                "Hamburguesa con doble carne",
                13000.0,
                15
            ),
            (
                "Pizzas",
                "Pizza muzzarella",
                "Pizza con muzzarella y aceitunas",
                11000.0,
                20
            ),
            (
                "Pizzas",
                "Pizza napolitana",
                "Pizza con tomate y ajo",
                12500.0,
                15
            ),
            (
                "Pizzas",
                "Pizza especial",
                "Pizza con jamón y morrones",
                14500.0,
                15
            ),
            (
                "Bebidas",
                "Agua mineral",
                "Botella de agua mineral",
                2500.0,
                40
            ),
            (
                "Bebidas",
                "Gaseosa",
                "Botella de gaseosa",
                3500.0,
                40
            ),
        ]

        for categoria_nombre, nombre, descripcion, precio, stock in productos:
            categoria_id = categoria_ids[categoria_nombre]

            producto_existente = session.exec(
                select(Producto).where(
                    col(Producto.nombre) == nombre,
                    col(Producto.categoria_id) == categoria_id
                )
            ).first()

            if producto_existente is None:
                producto = Producto(
                    categoria_id=categoria_id,
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    stock=stock,
                    disponible=True,
                    activo=True
                )

                session.add(producto)

    print("Seed de Food Store finalizado correctamente.")


if __name__ == "__main__":
    seed()
