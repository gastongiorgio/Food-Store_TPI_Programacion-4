import { useState } from "react"

import ProductoCard from "../components/ProductoCard"
import { useProductos } from "../hooks/useProductos"
import { useCategorias } from "../../categorias/hooks/useCategorias"
import { handleApiError } from "../../../shared/api/handleApiError"


const PAGE_SIZE = 6


function CatalogoPage() {
    const [search, setSearch] = useState("")
    const [categoryId, setCategoryId] = useState<number | undefined>()
    const [page, setPage] = useState(0)

    const {
        data,
        isPending,
        isError,
        error,
        refetch
    } = useProductos({
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        categoria_id: categoryId
    })

    const categorias = useCategorias()

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)


    function clearFilters() {
        setSearch("")
        setCategoryId(undefined)
        setPage(0)
    }


    return (
        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Catálogo de productos
                </h1>

                <p className="mt-2 text-slate-500">
                    Explorá nuestros productos y encontrá lo que estás buscando.
                </p>
            </div>


            {/* BÚSQUEDA Y FILTROS */}

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="grid gap-4 md:grid-cols-3">

                    <div className="md:col-span-2">

                        <label
                            htmlFor="product-search"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Buscar productos
                        </label>

                        <input
                            id="product-search"
                            type="search"
                            value={search}
                            placeholder="Ej.: pizza, hamburguesa..."
                            onChange={(event) => {
                                setSearch(event.target.value)
                                setPage(0)
                            }}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                        />
                        
                    </div>


                    <div>

                        <label
                            htmlFor="category-filter"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Categoría
                        </label>

                        <select
                            id="category-filter"
                            value={categoryId ?? ""}
                            disabled={categorias.isPending || categorias.isError}
                            onChange={(event) => {
                                const value = event.target.value

                                setCategoryId(
                                    value === "" ? undefined : Number(value)
                                )

                                setPage(0)
                            }}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:opacity-50"
                        >

                            <option value="">
                                Todas las categorías
                            </option>

                            {categorias.data?.map((categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.nombre}
                                </option>
                            ))}

                        </select>

                    </div>

                </div>


                {categorias.isError && (
                    <p role="alert" className="mt-3 text-sm text-red-600">
                        No se pudieron cargar las categorías.

                        <button
                            type="button"
                            onClick={() => void categorias.refetch()}
                            className="ml-2 font-medium underline"
                        >
                            Reintentar
                        </button>
                    </p>
                )}

            </div>


            {/* ESTADO DE CARGA */}

            {isPending ? (

                <div
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    aria-label="Cargando productos"
                    aria-busy="true"
                >
                    {Array.from({ length: PAGE_SIZE }, (_, index) => (
                        <div
                            key={index}
                            className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                            <div className="aspect-square bg-slate-200" />

                            <div className="space-y-4 p-5">
                                <div className="h-4 w-24 rounded bg-slate-200" />
                                <div className="h-6 w-3/4 rounded bg-slate-200" />
                                <div className="h-4 w-full rounded bg-slate-200" />
                                <div className="h-8 w-1/2 rounded bg-slate-200" />
                            </div>
                        </div>
                    ))}
                </div>

            ) : isError ? (

                /* ERROR AL CONSULTAR PRODUCTOS */

                <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-white px-6 py-10 text-center"
                >
                    <h2 className="text-lg font-semibold text-slate-800">
                        No se pudieron cargar los productos
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {handleApiError(error)}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-5 rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-500"
                    >
                        Reintentar
                    </button>
                </div>

            ) : data.items.length === 0 ? (

                /* NO SE ENCONTRARON PRODUCTOS */

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">

                    <div className="mb-4 text-5xl" aria-hidden="true">
                        🔎
                    </div>

                    <h2 className="text-lg font-semibold text-slate-800">
                        No encontramos productos
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Probá con otro nombre o cambiá la categoría seleccionada.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-500"
                    >
                        Limpiar filtros
                    </button>

                </div>

            ) : (

                /* PRODUCTOS Y PAGINACIÓN */

                <>
                    <p
                        className="mb-5 text-sm text-slate-600"
                        aria-live="polite"
                    >
                        {data.total} {data.total === 1
                            ? "producto encontrado"
                            : "productos encontrados"}
                    </p>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {data.items.map((producto) => (
                            <ProductoCard
                                key={producto.id}
                                producto={producto}
                            />
                        ))}

                    </div>


                    {totalPages > 1 && (
                        <nav
                            aria-label="Paginación de productos"
                            className="mt-8 flex items-center justify-center gap-4"
                        >

                            <button
                                type="button"
                                disabled={page === 0}
                                onClick={() => {
                                    setPage((current) => current - 1)
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Anterior
                            </button>

                            <span className="text-sm text-slate-600">
                                Página {page + 1} de {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page + 1 >= totalPages}
                                onClick={() => {
                                    setPage((current) => current + 1)
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Siguiente
                            </button>

                        </nav>
                    )}

                </>
            )}

        </section>
    )
}


export default CatalogoPage
