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
            raise ValueError(
                "Ya existe un usuario llamado admin sin rol de administrador."
            )

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
                raise RuntimeError(
                    f"La categoría {nombre} no tiene un id asignado."
                )

            categoria_ids[nombre] = categoria.id

        # Productos iniciales
        # Fotografías ilustrativas de Unsplash y Wikimedia Commons

        productos = [
            (
                "Hamburguesas",
                "Hamburguesa clásica",
                "Hamburguesa con lechuga y tomate",
                9000.0,
                20,
                "https://images.unsplash.com/photo-1757834787931-ddd70f3379a5?auto=format&fit=crop&w=800&h=800&q=85"
            ),
            (
                "Hamburguesas",
                "Hamburguesa con queso",
                "Hamburguesa con queso cheddar",
                10500.0,
                15,
                "https://images.unsplash.com/photo-1544719437-1462dac0f482?auto=format&fit=crop&w=800&h=800&q=85"
            ),
            (
                "Hamburguesas",
                "Hamburguesa doble",
                "Hamburguesa con doble carne",
                13000.0,
                15,
                "https://images.unsplash.com/photo-1599155253646-7989e08c05c1?auto=format&fit=crop&w=800&h=800&q=85"
            ),
            (
                "Pizzas",
                "Pizza muzzarella",
                "Pizza con muzzarella y aceitunas",
                11000.0,
                20,
                "https://commons.wikimedia.org/wiki/Special:FilePath/Pizza_de_muzzarella_al_estilo_argentino_servida_sobre_tabla_de_madera.jpg?width=800"
            ),
            (
                "Pizzas",
                "Pizza napolitana",
                "Pizza con tomate y ajo",
                12500.0,
                15,
                "https://images.unsplash.com/photo-1774806189229-ed02b4f77de1?auto=format&fit=crop&w=800&h=800&q=85"
            ),
            (
                "Pizzas",
                "Pizza especial",
                "Pizza con jamón cocido, morrones y huevo",
                14500.0,
                15,
                "https://commons.wikimedia.org/wiki/Special:FilePath/Pizza_mozzarella_con_huevos,_tomates,_jam%C3%B3n,_morr%C3%B3n_verde,_cebollas_y_especias.jpg?width=800"
            ),
            (
                "Bebidas",
                "Agua mineral",
                "Botella de agua mineral",
                2500.0,
                40,
                "https://images.unsplash.com/photo-1675914861279-921639cd47e1?auto=format&fit=crop&w=800&h=800&q=85"
            ),
            (
                "Bebidas",
                "Gaseosa",
                "Botella de gaseosa",
                3500.0,
                40,
                "https://images.unsplash.com/photo-1574706226623-e5cc0da928c6?auto=format&fit=crop&w=800&h=800&q=85"
            )
        ]

        # Fotografías utilizadas en versiones anteriores del seed.
        # Se reemplazan solamente las imágenes iniciales conocidas.
        # Una imagen personalizada se conserva.

        previous_images = {
            "Hamburguesa clásica": (
                "photo-1586816001966-79b736744398",
                "photo-1576843776838-032ac46fbb93",
                "photo-1553979459-d2229ba7433b"
            ),
            "Pizza muzzarella": (
                "photo-1774806189179-d85e97215555",
                "photo-1680405620826-83b0f0f61b28"
            ),
            "Pizza especial": (
                "photo-1743615357618-de4ac111c79c",
                "photo-1755554042272-6ffdd433be55",
                "photo-1564936281291-294551497d81"
            )
        }

        for categoria_nombre, nombre, descripcion, precio, stock, imagen_url in productos:
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
                    imagen_url=imagen_url,
                    disponible=True,
                    activo=True
                )

                session.add(producto)

            else:
                imagen_actual = producto_existente.imagen_url

                imagen_anterior_del_seed = any(
                    image_id in (imagen_actual or "")
                    for image_id in previous_images.get(nombre, ())
                )

                if not imagen_actual or imagen_anterior_del_seed:
                    producto_existente.imagen_url = imagen_url

    print("Seed de Food Store finalizado correctamente.")


if __name__ == "__main__":
    seed()
