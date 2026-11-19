from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class CategoriaNoEncontrada(Exception):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
        self.uow = uow

    def listar_productos(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> ProductosPaginados:

        with self.uow as uow:
            total, productos = uow.productos.search(
                skip=skip,
                limit=limit,
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
            )

            return ProductosPaginados(
                total=total,
                items=[
                    ProductoRead.model_validate(producto)
                    for producto in productos
                ],
            )

    def obtener_producto(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if producto is None or not producto.activo:
                raise ProductoNoEncontrado("Producto no encontrado.")

            return ProductoRead.model_validate(producto)

    def crear_producto(self, datos: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(datos.categoria_id)

            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada("Categoría no encontrada.")

            producto = Producto(**datos.model_dump())
            uow.productos.add(producto)

            return ProductoRead.model_validate(producto)

    def actualizar_producto(
        self,
        producto_id: int,
        datos: ProductoUpdate,
    ) -> ProductoRead:

        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if producto is None or not producto.activo:
                raise ProductoNoEncontrado("Producto no encontrado.")

            cambios = datos.model_dump(exclude_unset=True)

            if "categoria_id" in cambios:
                categoria = uow.categorias.get_by_id(
                    cambios["categoria_id"]
                )

                if categoria is None or not categoria.activo:
                    raise CategoriaNoEncontrada("Categoría no encontrada.")

            producto.sqlmodel_update(cambios)
            uow.productos.add(producto)

            return ProductoRead.model_validate(producto)

    def actualizar_stock(
        self,
        producto_id: int,
        datos: ProductoStockUpdate,
    ) -> ProductoRead:

        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if producto is None or not producto.activo:
                raise ProductoNoEncontrado("Producto no encontrado.")

            producto.stock = datos.stock
            producto.disponible = datos.disponible

            uow.productos.add(producto)

            return ProductoRead.model_validate(producto)

    def eliminar_producto(self, producto_id: int) -> None:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if producto is None or not producto.activo:
                raise ProductoNoEncontrado("Producto no encontrado.")

            producto.activo = False
            uow.productos.add(producto)