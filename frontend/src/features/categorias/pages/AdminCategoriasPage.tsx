import { useCallback, useMemo, useState } from "react"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table"

import type { ColumnDef } from "@tanstack/react-table"

import type {
    Categoria,
    CategoriaCreate
} from "../types/categorias"

import CategoriaForm from "../components/CategoriaForm"
import { useCategorias } from "../hooks/useCategorias"

import {
    useCrearCategoria,
    useActualizarCategoria,
    useEliminarCategoria
} from "../hooks/useCategoriaMutations"

import { handleApiError } from "../../../shared/api/handleApiError"


const PAGE_SIZE = 5
const EMPTY_CATEGORIES: Categoria[] = []


type FormularioEstado =
    | { tipo: "crear" }
    | { tipo: "editar"; categoria: Categoria }
    | null


function AdminCategoriasPage() {
    const [formulario, setFormulario] = useState<FormularioEstado>(null)
    const [categoriaParaEliminar, setCategoriaParaEliminar] = useState<Categoria | null>(null)
    const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null)
    const [mensajeExito, setMensajeExito] = useState<string | null>(null)

    // CONSULTA DE CATEGORÍAS
    const {
        data,
        isPending,
        isError,
        error,
        isFetching,
        refetch
    } = useCategorias()


    // MUTACIONES
    const crearCategoria = useCrearCategoria()
    const actualizarCategoria = useActualizarCategoria()
    const eliminarCategoria = useEliminarCategoria()


    // ABRIR FORMULARIO DE CREACIÓN
    function abrirCreacion() {
        setFormulario({ tipo: "crear" })
        setCategoriaParaEliminar(null)
        setErrorEliminacion(null)
        setMensajeExito(null)
    }


    // ABRIR FORMULARIO DE EDICIÓN
    const abrirEdicion = useCallback((categoria: Categoria) => {
        setFormulario({
            tipo: "editar",
            categoria
        })

        setCategoriaParaEliminar(null)
        setErrorEliminacion(null)
        setMensajeExito(null)
    }, [])


    // SOLICITAR CONFIRMACIÓN DE BAJA
    const solicitarEliminacion = useCallback((categoria: Categoria) => {
        setCategoriaParaEliminar(categoria)
        setFormulario(null)
        setErrorEliminacion(null)
        setMensajeExito(null)
    }, [])


    // GUARDAR CATEGORÍA
    async function guardarCategoria(datos: CategoriaCreate) {
        if (!formulario) {
            return
        }

        if (formulario.tipo === "editar") {
            await actualizarCategoria.mutateAsync({
                categoriaId: formulario.categoria.id,
                datos
            })

            setMensajeExito("Categoría actualizada correctamente.")
        } else {
            await crearCategoria.mutateAsync(datos)

            setMensajeExito("Categoría creada correctamente.")
        }

        setFormulario(null)
    }


    // CONFIRMAR BAJA LÓGICA
    async function confirmarEliminacion() {
        if (!categoriaParaEliminar) {
            return
        }

        setErrorEliminacion(null)

        try {
            await eliminarCategoria.mutateAsync(
                categoriaParaEliminar.id
            )

            setCategoriaParaEliminar(null)
            setMensajeExito("Categoría dada de baja correctamente.")
        } catch (error) {
            setErrorEliminacion(handleApiError(error))
        }
    }


    // COLUMNAS DE TANSTACK TABLE
    const columns = useMemo<ColumnDef<Categoria>[]>(() => [
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
            header: "Nombre",
            cell: ({ row }) => (
                <span className="font-semibold text-slate-800">
                    {row.original.nombre}
                </span>
            )
        },
        {
            accessorKey: "descripcion",
            header: "Descripción",
            cell: ({ row }) => (
                <span className="text-slate-600">
                    {row.original.descripcion || "Sin descripción"}
                </span>
            )
        },
        {
            accessorKey: "activo",
            header: "Estado",
            cell: ({ row }) => (
                <span
                    className={
                        row.original.activo
                            ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            : "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                    }
                >
                    {row.original.activo ? "Activa" : "Inactiva"}
                </span>
            )
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={() => abrirEdicion(row.original)}
                        className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={() => solicitarEliminacion(row.original)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                        Dar de baja
                    </button>

                </div>
            )
        }
    ], [abrirEdicion, solicitarEliminacion])


    // TABLA CON PAGINACIÓN DEL LADO DEL CLIENTE
    const table = useReactTable({
        data: data ?? EMPTY_CATEGORIES,
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
                        Administración de categorías
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Creá, editá y administrá las categorías de Food Store.
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
                        onClick={abrirCreacion}
                        disabled={formulario?.tipo === "crear"}
                        className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Nueva categoría
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

            {formulario && (
                <div className="mb-8">

                    <CategoriaForm
                        key={
                            formulario.tipo === "editar"
                                ? `editar-${formulario.categoria.id}`
                                : "crear"
                        }
                        categoria={
                            formulario.tipo === "editar"
                                ? formulario.categoria
                                : null
                        }
                        onGuardar={guardarCategoria}
                        onCancelar={() => setFormulario(null)}
                    />

                </div>
            )}

            {categoriaParaEliminar && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">

                    <h2 className="text-lg font-bold text-slate-800">
                        Confirmar baja de categoría
                    </h2>

                    <p className="mt-3 text-sm text-slate-700">
                        ¿Querés dar de baja la categoría{" "}
                        <strong>{categoriaParaEliminar.nombre}</strong>?
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                        La categoría dejará de aparecer en los listados
                        de categorías activas, pero seguirá registrada
                        en la base de datos.
                    </p>


                    {errorEliminacion && (
                        <p
                            role="alert"
                            className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700"
                        >
                            {errorEliminacion}
                        </p>
                    )}


                    <div className="mt-5 flex flex-wrap justify-end gap-3">

                        <button
                            type="button"
                            disabled={eliminarCategoria.isPending}
                            onClick={() => {
                                setCategoriaParaEliminar(null)
                                setErrorEliminacion(null)
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            disabled={eliminarCategoria.isPending}
                            onClick={() => void confirmarEliminacion()}
                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {eliminarCategoria.isPending
                                ? "Procesando..."
                                : "Confirmar baja"}
                        </button>

                    </div>

                </div>
            )}

            {isPending ? (

                <div
                    role="status"
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                    <p className="mb-5 text-sm text-slate-500">
                        Cargando categorías...
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

                    <p
                        role="alert"
                        className="text-sm text-red-600"
                    >
                        {handleApiError(error)}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
                    >
                        Reintentar
                    </button>

                </div>

            ) : data.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-800">
                        No hay categorías activas
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Podés registrar una nueva categoría
                        utilizando el botón superior.
                    </p>

                </div>

            ) : (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">

                        <h2 className="text-lg font-semibold text-slate-800">
                            Listado de categorías
                        </h2>

                        <span className="text-sm text-slate-500">
                            {data.length} {data.length === 1
                                ? "categoría activa"
                                : "categorías activas"}
                        </span>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-175 text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>

                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                scope="col"
                                                className="px-6 py-4 font-semibold"
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
                                                className="px-6 py-4"
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

            {!isPending && !isError && data.length > 0 && (
                <p className="mt-5 text-xs text-slate-500">
                    Se muestran únicamente categorías activas.
                    Las categorías dadas de baja se conservan en la base de datos.
                </p>
            )}

        </section>
    )
}


export default AdminCategoriasPage