import { useCallback, useMemo, useState } from "react"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table"

import type { ColumnDef } from "@tanstack/react-table"

import type {
    Producto,
    ProductoCreate,
    ProductoUpdate,
    ProductoStockUpdate
} from "../types/productos"

import ProductoForm from "../components/ProductoForm"
import ProductoStockForm from "../components/ProductoStockForm"

import { useProductos } from "../hooks/useProductos"
import { useCategorias } from "../../categorias/hooks/useCategorias"

import {
    useCrearProducto,
    useActualizarProducto,
    useActualizarStock,
    useEliminarProducto
} from "../hooks/useProductoMutations"

import { handleApiError } from "../../../shared/api/handleApiError"


const PAGE_SIZE = 10
const ADMIN_LIMIT = 100
const EMPTY_PRODUCTS: Producto[] = []

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})


type VistaActiva =
    | { tipo: "crear" }
    | { tipo: "editar"; producto: Producto }
    | { tipo: "stock"; producto: Producto }
    | { tipo: "baja"; producto: Producto }
    | null


function AdminProductosPage() {
    const [vista, setVista] = useState<VistaActiva>(null)
    const [mensajeExito, setMensajeExito] = useState<string | null>(null)
    const [errorBaja, setErrorBaja] = useState<string | null>(null)

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

    const categorias = useCategorias()

    const crearProducto = useCrearProducto()
    const actualizarProducto = useActualizarProducto()
    const actualizarStock = useActualizarStock()
    const eliminarProducto = useEliminarProducto()


    const seleccionarVista = useCallback((nuevaVista: VistaActiva) => {
        setVista(nuevaVista)
        setMensajeExito(null)
        setErrorBaja(null)
    }, [])


    async function guardarCreacion(datos: ProductoCreate) {
        await crearProducto.mutateAsync(datos)

        setVista(null)
        setMensajeExito("Producto creado correctamente.")
    }


    async function guardarEdicion(datos: ProductoUpdate) {
        if (vista?.tipo !== "editar") {
            return
        }

        await actualizarProducto.mutateAsync({
            productoId: vista.producto.id,
            datos
        })

        setVista(null)
        setMensajeExito("Producto actualizado correctamente.")
    }


    async function guardarStock(datos: ProductoStockUpdate) {
        if (vista?.tipo !== "stock") {
            return
        }

        await actualizarStock.mutateAsync({
            productoId: vista.producto.id,
            datos
        })

        setVista(null)
        setMensajeExito("Stock y disponibilidad actualizados correctamente.")
    }


    async function confirmarBaja() {
        if (vista?.tipo !== "baja") {
            return
        }

        setErrorBaja(null)

        try {
            await eliminarProducto.mutateAsync(vista.producto.id)

            setVista(null)
            setMensajeExito("Producto dado de baja correctamente.")
        } catch (error) {
            setErrorBaja(handleApiError(error))
        }
    }


    const columns = useMemo<ColumnDef<Producto>[]>(() => [
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
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex flex-wrap items-center gap-2">

                    <button
                        type="button"
                        onClick={() => seleccionarVista({
                            tipo: "editar",
                            producto: row.original
                        })}
                        className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={() => seleccionarVista({
                            tipo: "stock",
                            producto: row.original
                        })}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                        Stock
                    </button>

                    <button
                        type="button"
                        onClick={() => seleccionarVista({
                            tipo: "baja",
                            producto: row.original
                        })}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                        Dar de baja
                    </button>

                </div>
            )
        }
    ], [seleccionarVista])


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
                        Gestioná los productos, sus precios, stock y disponibilidad.
                    </p>

                </div>

                <div className="flex flex-wrap items-center gap-3">

                    <button
                        type="button"
                        disabled={isFetching}
                        onClick={() => void refetch()}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isFetching ? "Actualizando..." : "Actualizar"}
                    </button>

                    <button
                        type="button"
                        disabled={vista?.tipo === "crear"}
                        onClick={() => seleccionarVista({ tipo: "crear" })}
                        className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Nuevo producto
                    </button>

                </div>

            </div>

            {mensajeExito && (
                <div
                    role="status"
                    className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700"
                >
                    {mensajeExito}
                </div>
            )}

            {(vista?.tipo === "crear" || vista?.tipo === "editar") && (
                <div className="mb-8">

                    {categorias.isPending ? (

                        <div
                            role="status"
                            className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500"
                        >
                            Cargando categorías...
                        </div>

                    ) : categorias.isError ? (

                        <div className="rounded-xl border border-red-200 bg-white p-6">

                            <p role="alert" className="text-sm text-red-600">
                                {handleApiError(categorias.error)}
                            </p>

                            <button
                                type="button"
                                onClick={() => void categorias.refetch()}
                                className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
                            >
                                Reintentar
                            </button>

                        </div>

                    ) : (

                        <ProductoForm
                            key={
                                vista.tipo === "editar"
                                    ? `editar-${vista.producto.id}`
                                    : "crear"
                            }
                            producto={
                                vista.tipo === "editar"
                                    ? vista.producto
                                    : null
                            }
                            categorias={categorias.data}
                            onCrear={guardarCreacion}
                            onActualizar={guardarEdicion}
                            onCancelar={() => setVista(null)}
                        />

                    )}

                </div>
            )}

            {vista?.tipo === "stock" && (
                <div className="mb-8">

                    <ProductoStockForm
                        key={`stock-${vista.producto.id}`}
                        producto={vista.producto}
                        onGuardar={guardarStock}
                        onCancelar={() => setVista(null)}
                    />

                </div>
            )}

            {vista?.tipo === "baja" && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">

                    <h2 className="text-lg font-bold text-slate-800">
                        Confirmar baja de producto
                    </h2>

                    <p className="mt-3 text-sm text-slate-700">
                        ¿Querés dar de baja el producto{" "}
                        <strong>{vista.producto.nombre}</strong>?
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                        El producto dejará de aparecer en los listados
                        de productos activos, pero seguirá registrado
                        en la base de datos.
                    </p>

                    {errorBaja && (
                        <p
                            role="alert"
                            className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700"
                        >
                            {errorBaja}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap justify-end gap-3">

                        <button
                            type="button"
                            disabled={eliminarProducto.isPending}
                            onClick={() => seleccionarVista(null)}
                            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            disabled={eliminarProducto.isPending}
                            onClick={() => void confirmarBaja()}
                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {eliminarProducto.isPending
                                ? "Procesando..."
                                : "Confirmar baja"}
                        </button>

                    </div>

                </div>
            )}

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

                    <p role="alert" className="mt-3 text-sm text-red-600">
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
                        Podés registrar uno utilizando el botón superior.
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

                        <table className="w-full min-w-240 text-left text-sm">

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