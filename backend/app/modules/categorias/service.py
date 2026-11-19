from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:

    def __init__(self, uow: CategoriaUnitOfWork) -> None:
        self.uow = uow

    def crear_categoria(self, datos: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            existente = uow.categorias.get_by_nombre(datos.nombre)

            if existente is not None:
                raise NombreDuplicado("Ya existe una categoría con ese nombre.")

            categoria = Categoria(**datos.model_dump())
            uow.categorias.add(categoria)

            return CategoriaRead.model_validate(categoria)

    def listar_categorias(self) -> list[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.listar_activas()

            return [
                CategoriaRead.model_validate(categoria)
                for categoria in categorias
            ]

    def obtener_categoria(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)

            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada("Categoría no encontrada.")

            return CategoriaRead.model_validate(categoria)

    def actualizar_categoria(
        self,
        categoria_id: int,
        datos: CategoriaUpdate,
    ) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)

            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada("Categoría no encontrada.")

            cambios = datos.model_dump(exclude_unset=True)

            if "nombre" in cambios:
                existente = uow.categorias.get_by_nombre(cambios["nombre"])

                if existente is not None and existente.id != categoria_id:
                    raise NombreDuplicado("Ya existe una categoría con ese nombre.")

            categoria.sqlmodel_update(cambios)
            uow.categorias.add(categoria)

            return CategoriaRead.model_validate(categoria)

    def eliminar_categoria(self, categoria_id: int) -> None:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)

            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada("Categoría no encontrada.")

            categoria.activo = False
            uow.categorias.add(categoria)
