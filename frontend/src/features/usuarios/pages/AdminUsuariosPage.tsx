import { useCallback, useMemo, useState } from "react"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "../../auth/types/auth"

import { useAuthStore } from "../../../store/authStore"
import { useUsuarios } from "../hooks/useUsuarios"

import {
    useActivarUsuario,
    useDesactivarUsuario
} from "../hooks/useUsuarioMutations"

import { handleApiError } from "../../../shared/api/handleApiError"


const PAGE_SIZE = 10
const EMPTY_USERS: User[] = []


function AdminUsuariosPage() {
    const usuarioActual = useAuthStore((state) => state.usuario)

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<User | null>(null)
    const [mensajeExito, setMensajeExito] = useState<string | null>(null)
    const [errorOperacion, setErrorOperacion] = useState<string | null>(null)

    const {
        data,
        isPending,
        isError,
        error,
        isFetching,
        refetch
    } = useUsuarios()

    const activarUsuario = useActivarUsuario()
    const desactivarUsuario = useDesactivarUsuario()

    const procesando = activarUsuario.isPending || desactivarUsuario.isPending


    const solicitarAccion = useCallback((usuario: User) => {
        if (!usuario.disabled && usuario.id === usuarioActual?.id) {
            return
        }

        setUsuarioSeleccionado(usuario)
        setMensajeExito(null)
        setErrorOperacion(null)
    }, [usuarioActual?.id])


    async function confirmarAccion() {
        if (!usuarioSeleccionado) {
            return
        }

        if (
            !usuarioSeleccionado.disabled &&
            usuarioSeleccionado.id === usuarioActual?.id
        ) {
            return
        }

        setErrorOperacion(null)

        try {
            if (usuarioSeleccionado.disabled) {
                await activarUsuario.mutateAsync(usuarioSeleccionado.id)

                setMensajeExito(
                    `La cuenta de ${usuarioSeleccionado.username} fue activada correctamente.`
                )
            } else {
                await desactivarUsuario.mutateAsync(usuarioSeleccionado.id)

                setMensajeExito(
                    `La cuenta de ${usuarioSeleccionado.username} fue desactivada correctamente.`
                )
            }

            setUsuarioSeleccionado(null)
        } catch (error) {
            setErrorOperacion(handleApiError(error))
        }
    }


    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            accessorKey: "username",
            header: "Usuario",
            cell: ({ row }) => (
                <div className="min-w-30">

                    <p className="font-semibold text-slate-800">
                        {row.original.username}
                    </p>

                    {row.original.id === usuarioActual?.id && (
                        <p className="mt-1 text-xs text-teal-700">
                            Tu cuenta
                        </p>
                    )}

                </div>
            )
        },
        {
            accessorKey: "full_name",
            header: "Nombre completo",
            cell: ({ row }) => (
                <span className="text-slate-700">
                    {row.original.full_name}
                </span>
            )
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="text-slate-600">
                    {row.original.email}
                </span>
            )
        },
        {
            accessorKey: "role",
            header: "Rol",
            cell: ({ row }) => (
                <span
                    className={
                        row.original.role === "admin"
                            ? "inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                            : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    }
                >
                    {row.original.role === "admin"
                        ? "Administrador"
                        : "Cliente"}
                </span>
            )
        },
        {
            accessorKey: "disabled",
            header: "Estado",
            cell: ({ row }) => (
                <span
                    className={
                        row.original.disabled
                            ? "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                            : "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                    }
                >
                    {row.original.disabled
                        ? "Desactivado"
                        : "Activo"}
                </span>
            )
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const usuario = row.original

                if (usuario.id === usuarioActual?.id) {
                    return (
                        <span className="text-xs text-slate-400">
                            Tu cuenta
                        </span>
                    )
                }

                return (
                    <button
                        type="button"
                        disabled={procesando}
                        onClick={() => solicitarAccion(usuario)}
                        className={
                            usuario.disabled
                                ? "rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                                : "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        }
                    >
                        {usuario.disabled
                            ? "Activar"
                            : "Desactivar"}
                    </button>
                )
            }
        }
    ], [usuarioActual?.id, procesando, solicitarAccion])


    const table = useReactTable({
        data: data ?? EMPTY_USERS,
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
                        Administración de usuarios
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Consultá los usuarios registrados y administrá
                        el acceso a sus cuentas.
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

            {mensajeExito && (
                <div
                    role="status"
                    className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700"
                >
                    {mensajeExito}
                </div>
            )}

            {usuarioSeleccionado && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">

                    <h2 className="text-lg font-bold text-slate-800">
                        {usuarioSeleccionado.disabled
                            ? "Confirmar activación de usuario"
                            : "Confirmar desactivación de usuario"}
                    </h2>

                    <p className="mt-3 text-sm text-slate-700">
                        ¿Querés{" "}
                        {usuarioSeleccionado.disabled
                            ? "activar"
                            : "desactivar"}{" "}
                        la cuenta de{" "}
                        <strong>{usuarioSeleccionado.username}</strong>?
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                        {usuarioSeleccionado.disabled
                            ? "El usuario podrá volver a iniciar sesión y utilizar su cuenta."
                            : "El usuario no podrá iniciar sesión ni utilizar las funciones que requieren autenticación mientras su cuenta esté desactivada."}
                    </p>

                    {errorOperacion && (
                        <p
                            role="alert"
                            className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700"
                        >
                            {errorOperacion}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap justify-end gap-3">

                        <button
                            type="button"
                            disabled={procesando}
                            onClick={() => {
                                setUsuarioSeleccionado(null)
                                setErrorOperacion(null)
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Volver
                        </button>

                        <button
                            type="button"
                            disabled={procesando}
                            onClick={() => void confirmarAccion()}
                            className={
                                usuarioSeleccionado.disabled
                                    ? "rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    : "rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            }
                        >
                            {procesando
                                ? "Procesando..."
                                : usuarioSeleccionado.disabled
                                    ? "Confirmar activación"
                                    : "Confirmar desactivación"}
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
                        Cargando usuarios...
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
                        No se pudieron cargar los usuarios
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

            ) : data.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-800">
                        No hay usuarios registrados
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Todavía no existen cuentas para mostrar.
                    </p>

                </div>

            ) : (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">

                        <h2 className="text-lg font-semibold text-slate-800">
                            Listado de usuarios
                        </h2>

                        <span className="text-sm text-slate-500">
                            {data.length} {data.length === 1
                                ? "usuario registrado"
                                : "usuarios registrados"}
                        </span>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-220 text-left text-sm">

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

                    {table.getPageCount() > 1 && (
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
                    )}

                </div>

            )}

        </section>
    )
}


export default AdminUsuariosPage