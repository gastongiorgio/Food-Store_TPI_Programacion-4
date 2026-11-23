import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getPedidos } from "../api/pedidos"
import { useCambiarEstadoPedido } from "../hooks/useCambiarEstadoPedido"

import type {
    Pedido,
    EstadoPedido
} from "../types/pedidos"

import { handleApiError } from "../../../shared/api/handleApiError"


const PAGE_SIZE = 10

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})


const estados: Record<EstadoPedido, string> = {
    PENDIENTE: "Pendiente",
    EN_PREPARACION: "En preparación",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado"
}


const estilosEstado: Record<EstadoPedido, string> = {
    PENDIENTE: "bg-amber-50 text-amber-700",
    EN_PREPARACION: "bg-blue-50 text-blue-700",
    ENTREGADO: "bg-emerald-50 text-emerald-700",
    CANCELADO: "bg-red-50 text-red-700"
}


type CambioPendiente = {
    pedido: Pedido
    nuevoEstado: EstadoPedido
} | null


function AdminPedidosPage() {
    const [page, setPage] = useState(0)
    const [estado, setEstado] = useState<EstadoPedido | "">("")
    const [detalleAbierto, setDetalleAbierto] = useState<number | null>(null)
    const [cambioPendiente, setCambioPendiente] = useState<CambioPendiente>(null)
    const [mensajeExito, setMensajeExito] = useState<string | null>(null)
    const [errorCambio, setErrorCambio] = useState<string | null>(null)

    const {
        data,
        isPending,
        isError,
        error,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ["pedidos", "admin", page, estado],
        queryFn: () => getPedidos(
            page * PAGE_SIZE,
            PAGE_SIZE,
            estado || undefined
        )
    })

    const cambiarEstado = useCambiarEstadoPedido()

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)


    function cambiarFiltro(nuevoEstado: EstadoPedido | "") {
        setEstado(nuevoEstado)
        setPage(0)
        setDetalleAbierto(null)
        setCambioPendiente(null)
        setErrorCambio(null)
        setMensajeExito(null)
    }


    function cambiarPagina(nuevaPagina: number) {
        setPage(nuevaPagina)
        setDetalleAbierto(null)
        setCambioPendiente(null)
        setErrorCambio(null)
        setMensajeExito(null)
    }


    function solicitarCambio(
        pedido: Pedido,
        nuevoEstado: EstadoPedido
    ) {
        setCambioPendiente({
            pedido,
            nuevoEstado
        })

        setErrorCambio(null)
        setMensajeExito(null)
    }


    async function confirmarCambio() {
        if (!cambioPendiente) {
            return
        }

        setErrorCambio(null)

        try {
            await cambiarEstado.mutateAsync({
                pedidoId: cambioPendiente.pedido.id,
                estado: cambioPendiente.nuevoEstado
            })

            setMensajeExito(
                `El pedido #${cambioPendiente.pedido.id} pasó a ${estados[cambioPendiente.nuevoEstado]}.`
            )

            setCambioPendiente(null)
            setDetalleAbierto(null)
            setPage(0)
        } catch (error) {
            setErrorCambio(handleApiError(error))
        }
    }


    return (
        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">

            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Administración de pedidos
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Consultá los pedidos y administrá sus estados.
                    </p>

                </div>

                <button
                    type="button"
                    disabled={isFetching}
                    onClick={() => void refetch()}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isFetching ? "Actualizando..." : "Actualizar"}
                </button>

            </div>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <label
                    htmlFor="filtro-estado"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Filtrar por estado
                </label>

                <select
                    id="filtro-estado"
                    value={estado}
                    disabled={cambiarEstado.isPending}
                    onChange={(event) => cambiarFiltro(
                        event.target.value as EstadoPedido | ""
                    )}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:opacity-50 sm:max-w-xs"
                >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="EN_PREPARACION">En preparación</option>
                    <option value="ENTREGADO">Entregados</option>
                    <option value="CANCELADO">Cancelados</option>
                </select>

            </div>


            {mensajeExito && (
                <div
                    role="status"
                    className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700"
                >
                    {mensajeExito}
                </div>
            )}

            {cambioPendiente && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">

                    <h2 className="text-lg font-bold text-slate-800">
                        Confirmar cambio de estado
                    </h2>

                    <p className="mt-3 text-sm text-slate-700">
                        ¿Querés cambiar el pedido{" "}
                        <strong>#{cambioPendiente.pedido.id}</strong>{" "}
                        de{" "}
                        <strong>
                            {estados[cambioPendiente.pedido.estado]}
                        </strong>{" "}
                        a{" "}
                        <strong>
                            {estados[cambioPendiente.nuevoEstado]}
                        </strong>?
                    </p>

                    {cambioPendiente.nuevoEstado === "CANCELADO" && (
                        <p className="mt-3 text-sm text-slate-600">
                            Al cancelar el pedido, el backend repondrá
                            el stock de los productos correspondientes.
                        </p>
                    )}


                    {errorCambio && (
                        <p
                            role="alert"
                            className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700"
                        >
                            {errorCambio}
                        </p>
                    )}


                    <div className="mt-5 flex flex-wrap justify-end gap-3">

                        <button
                            type="button"
                            disabled={cambiarEstado.isPending}
                            onClick={() => {
                                setCambioPendiente(null)
                                setErrorCambio(null)
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Volver
                        </button>

                        <button
                            type="button"
                            disabled={cambiarEstado.isPending}
                            onClick={() => void confirmarCambio()}
                            className={
                                cambioPendiente.nuevoEstado === "CANCELADO"
                                    ? "rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    : "rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                            }
                        >
                            {cambiarEstado.isPending
                                ? "Procesando..."
                                : "Confirmar cambio"}
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
                        Cargando pedidos...
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
                        No se pudieron cargar los pedidos
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
                        No se encontraron pedidos
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        No hay pedidos que coincidan con el filtro seleccionado.
                    </p>

                    {estado !== "" && (
                        <button
                            type="button"
                            onClick={() => cambiarFiltro("")}
                            className="mt-5 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500"
                        >
                            Ver todos los pedidos
                        </button>
                    )}

                </div>

            ) : (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">

                        <h2 className="text-lg font-semibold text-slate-800">
                            Listado de pedidos
                        </h2>

                        <span className="text-sm text-slate-500">
                            {data.total} {data.total === 1
                                ? "pedido encontrado"
                                : "pedidos encontrados"}
                        </span>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-230 text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                                <tr>

                                    <th scope="col" className="px-5 py-4 font-semibold">
                                        Pedido
                                    </th>

                                    <th scope="col" className="px-5 py-4 font-semibold">
                                        Fecha
                                    </th>

                                    <th scope="col" className="px-5 py-4 font-semibold">
                                        Usuario
                                    </th>

                                    <th scope="col" className="px-5 py-4 font-semibold">
                                        Estado
                                    </th>

                                    <th scope="col" className="px-5 py-4 font-semibold">
                                        Total
                                    </th>

                                    <th scope="col" className="px-5 py-4 font-semibold">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {data.items.map((pedido) => (
                                    <tr
                                        key={pedido.id}
                                        className="transition hover:bg-slate-50"
                                    >

                                        <td className="px-5 py-4 font-semibold text-slate-800">
                                            #{pedido.id}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                            {new Date(pedido.created_at).toLocaleString("es-AR")}
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            #{pedido.usuario_id}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${estilosEstado[pedido.estado]}`}
                                            >
                                                {estados[pedido.estado]}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                                            {priceFormatter.format(pedido.total)}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <button
                                                    type="button"
                                                    aria-expanded={detalleAbierto === pedido.id}
                                                    onClick={() => setDetalleAbierto(
                                                        detalleAbierto === pedido.id
                                                            ? null
                                                            : pedido.id
                                                    )}
                                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    {detalleAbierto === pedido.id
                                                        ? "Ocultar detalle"
                                                        : "Ver detalle"}
                                                </button>


                                                {pedido.estado === "PENDIENTE" && (
                                                    <button
                                                        type="button"
                                                        disabled={cambiarEstado.isPending}
                                                        onClick={() => solicitarCambio(
                                                            pedido,
                                                            "EN_PREPARACION"
                                                        )}
                                                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                                                    >
                                                        Iniciar preparación
                                                    </button>
                                                )}


                                                {pedido.estado === "EN_PREPARACION" && (
                                                    <button
                                                        type="button"
                                                        disabled={cambiarEstado.isPending}
                                                        onClick={() => solicitarCambio(
                                                            pedido,
                                                            "ENTREGADO"
                                                        )}
                                                        className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100 disabled:opacity-50"
                                                    >
                                                        Entregar
                                                    </button>
                                                )}


                                                {(pedido.estado === "PENDIENTE" ||
                                                    pedido.estado === "EN_PREPARACION") && (
                                                    <button
                                                        type="button"
                                                        disabled={cambiarEstado.isPending}
                                                        onClick={() => solicitarCambio(
                                                            pedido,
                                                            "CANCELADO"
                                                        )}
                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                    {data.items
                        .filter((pedido) => pedido.id === detalleAbierto)
                        .map((pedido) => (
                            <div
                                key={pedido.id}
                                className="border-t border-teal-200 bg-teal-50/40 px-6 py-6"
                            >

                                <h3 className="text-lg font-semibold text-slate-800">
                                    Detalle del pedido #{pedido.id}
                                </h3>

                                <div className="mt-5 grid gap-5 md:grid-cols-2">

                                    <div className="space-y-3 text-sm text-slate-600">

                                        <p>
                                            <span className="font-semibold text-slate-800">
                                                Usuario:
                                            </span>{" "}
                                            #{pedido.usuario_id}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-slate-800">
                                                Dirección de entrega:
                                            </span>{" "}
                                            {pedido.direccion_entrega}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-slate-800">
                                                Forma de pago:
                                            </span>{" "}
                                            {pedido.forma_pago === "EFECTIVO"
                                                ? "Efectivo"
                                                : "Transferencia"}
                                        </p>

                                        {pedido.notas && (
                                            <p>
                                                <span className="font-semibold text-slate-800">
                                                    Notas:
                                                </span>{" "}
                                                {pedido.notas}
                                            </p>
                                        )}

                                    </div>

                                    <div className="space-y-3">

                                        <h4 className="text-sm font-semibold text-slate-800">
                                            Productos del pedido
                                        </h4>

                                        {pedido.items.map((item) => (
                                            <div
                                                key={item.producto_id}
                                                className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 text-sm"
                                            >

                                                <div>

                                                    <p className="font-medium text-slate-700">
                                                        {item.nombre_producto}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {item.cantidad} × {priceFormatter.format(item.precio_unitario)}
                                                    </p>

                                                </div>

                                                <span className="font-semibold text-slate-800">
                                                    {priceFormatter.format(item.subtotal)}
                                                </span>

                                            </div>
                                        ))}

                                        <div className="flex justify-between gap-4 pt-2">

                                            <span className="font-semibold text-slate-800">
                                                Total
                                            </span>

                                            <span className="text-lg font-bold text-teal-700">
                                                {priceFormatter.format(pedido.total)}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        ))}

                    {totalPages > 1 && (
                        <nav
                            aria-label="Paginación de pedidos"
                            className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4"
                        >

                            <span className="text-sm text-slate-500">
                                Página {page + 1} de {totalPages}
                            </span>

                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    disabled={page === 0 || cambiarEstado.isPending}
                                    onClick={() => cambiarPagina(page - 1)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Anterior
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        page + 1 >= totalPages ||
                                        cambiarEstado.isPending
                                    }
                                    onClick={() => cambiarPagina(page + 1)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Siguiente
                                </button>

                            </div>

                        </nav>
                    )}

                </div>

            )}

        </section>
    )
}


export default AdminPedidosPage