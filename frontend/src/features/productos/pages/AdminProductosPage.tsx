import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table"

import type { ColumnDef } from "@tanstack/react-table"

import type { Producto } from "../types/productos"

import { useProductos } from "../hooks/useProductos"
import { handleApiError } from "../../../shared/api/handleApiError"


const PAGE_SIZE = 10
const ADMIN_LIMIT = 100
const EMPTY_PRODUCTS: Producto[] = []


const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})


// COLUMNAS DE TANSTACK TABLE
const columns: ColumnDef<Producto>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <span className="text-slate-500">
                {row.original.id}
            </span>
        )
    },
    {
        accessorKey: "nombre",
        header: "Producto",
        cell: ({ row }) => (
            <div className="min-w-44">

                <p className="font-semibold text-slate-800">
                    {row.original.nombre}
                </p>

                <p className="mt-1 max-w-64 truncate text-xs text-slate-500">
                    {row.original.descripcion || "Sin descripción"}
                </p>

            </div>
        )
    },
    {
        accessorKey: "categoria.nombre",
        header: "Categoría",
        cell: ({ row }) => (
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {row.original.categoria.nombre}
            </span>
        )
    },
    {
        accessorKey: "precio_base",
        header: "Precio",
        cell: ({ row }) => (
            <span className="whitespace-nowrap font-semibold text-slate-800">
                {priceFormatter.format(row.original.precio_base)}
            </span>
        )
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => (
            <span
                className={
                    row.original.stock > 0
                        ? "font-semibold text-slate-700"
                        : "font-semibold text-red-600"
                }
            >
                {row.original.stock}
            </span>
        )
    },
    {
        accessorKey: "disponible",
        header: "Disponibilidad",
        cell: ({ row }) => (
            <span
                className={
                    row.original.disponible
                        ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                        : "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                }
            >
                {row.original.disponible
                    ? "Disponible"
                    : "No disponible"}
            </span>
        )
    }
]


function AdminProductosPage() {

    // CONSULTA DE PRODUCTOS PARA EL PANEL
    const {
        data,
        isPending,
        isError,
        error,
        isFetching,
        refetch
    } = useProductos({
        skip: 0,
        limit: ADMIN_LIMIT
    })


    // TABLA CON PAGINACIÓN DEL LADO DEL CLIENTE
    const table = useReactTable({
        data: data?.items ?? EMPTY_PRODUCTS,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: PAGE_SIZE
            }
        }
    })


    return (
        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">

            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Administración de productos
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Consultá los productos, sus precios, stock y disponibilidad.
                    </p>

                </div>

                <button
                    type="button"
                    disabled={isFetching}
                    onClick={() => void refetch()}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isFetching
                        ? "Actualizando..."
                        : "Actualizar"}
                </button>

            </div>

            {isPending ? (

                <div
                    role="status"
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                    <p className="mb-5 text-sm text-slate-500">
                        Cargando productos...
                    </p>

                    <div className="space-y-4">

                        {Array.from({ length: PAGE_SIZE }, (_, index) => (
                            <div
                                key={index}
                                className="h-10 animate-pulse rounded-lg bg-slate-100"
                            />
                        ))}

                    </div>

                </div>

            ) : isError ? (

                <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-800">
                        No se pudieron cargar los productos
                    </h2>

                    <p
                        role="alert"
                        className="mt-3 text-sm text-red-600"
                    >
                        {handleApiError(error)}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-5 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500"
                    >
                        Reintentar
                    </button>

                </div>

            ) : data.items.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-800">
                        No hay productos activos
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Todavía no hay productos para mostrar.
                    </p>

                </div>

            ) : (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">

                        <h2 className="text-lg font-semibold text-slate-800">
                            Listado de productos
                        </h2>

                        <span className="text-sm text-slate-500">
                            {data.items.length === data.total
                                ? `${data.total} productos activos`
                                : `Mostrando ${data.items.length} de ${data.total} productos activos`}
                        </span>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-200 text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>

                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                scope="col"
                                                className="px-5 py-4 font-semibold"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}

                                    </tr>
                                ))}

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="transition hover:bg-slate-50"
                                    >

                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-5 py-4 align-middle"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">

                        <p className="text-sm text-slate-500">
                            Página {table.getState().pagination.pageIndex + 1} de{" "}
                            {table.getPageCount()}
                        </p>

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                disabled={!table.getCanPreviousPage()}
                                onClick={() => table.previousPage()}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Anterior
                            </button>

                            <button
                                type="button"
                                disabled={!table.getCanNextPage()}
                                onClick={() => table.nextPage()}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Siguiente
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {!isPending && !isError && data.items.length > 0 && (
                <p className="mt-5 text-xs text-slate-500">
                    Se muestran únicamente productos activos.
                    La disponibilidad y el stock se administran por separado.
                    Los productos dados de baja se conservan en la base de datos.
                </p>
            )}

        </section>
    )
}


export default AdminProductosPage