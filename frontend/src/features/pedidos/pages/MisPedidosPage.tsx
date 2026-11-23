import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useLocation } from "react-router-dom"

import { handleApiError } from "../../../shared/api/handleApiError"
import { cancelarPedido, getPedidos } from "../api/pedidos"


const PAGE_SIZE = 20

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})

function MisPedidosPage() {
    const location = useLocation()
    const queryClient = useQueryClient()

    const [page, setPage] = useState(0)
    const [pedidoAConfirmar, setPedidoAConfirmar] = useState<number | null>(null)
    const [errorCancelar, setErrorCancelar] = useState<string | null>(null)

    const navigationState = location.state as {pedidoCreado?: number} | null

    const pedidoCreado = navigationState?.pedidoCreado

    const {
        data,
        isPending,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["pedidos", page],
        queryFn: () => getPedidos(page * PAGE_SIZE, PAGE_SIZE)
    })

    const cancelar = useMutation({
        mutationFn: cancelarPedido,

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["pedidos"]
                }),
                queryClient.invalidateQueries({
                    queryKey: ["productos"]
                }),
                queryClient.invalidateQueries({
                    queryKey: ["producto"]
                })
            ])
        }
    })

    async function handleCancelar(pedidoId: number) {
        setErrorCancelar(null)

        try {
            await cancelar.mutateAsync(pedidoId)
            setPedidoAConfirmar(null)
        } catch (error) {
            setErrorCancelar(handleApiError(error))
        }
    }

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

    return (
        <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-800">
                    Mis pedidos
                </h1>

                <p className="mt-2 text-slate-500">
                    Consultá el estado y el detalle de tus pedidos.
                </p>

            </div>

            {pedidoCreado && (
                <div
                    role="status"
                    className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800"
                >
                    El pedido #{pedidoCreado} se creó correctamente.
                </div>
            )}

            {errorCancelar && (
                <div
                    role="alert"
                    className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
                >
                    {errorCancelar}
                </div>
            )}

            {isPending ? (
                <p role="status" className="text-sm text-slate-600">
                    Cargando pedidos...
                </p>
            ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-white p-6">

                    <p className="text-sm text-red-600">
                        {handleApiError(error)}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-4 font-medium text-teal-700 underline"
                    >
                        Reintentar
                    </button>

                </div>
            ) : data.items.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

                    <h2 className="text-lg font-semibold text-slate-800">
                        Todavía no hay pedidos
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Cuando confirmes tu primera compra, aparecerá acá.
                    </p>

                    <Link
                        to="/"
                        className="mt-5 inline-block rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-500"
                    >
                        Ver catálogo
                    </Link>

                </div>
            ) : (
                <>
                    <div className="space-y-5">

                        {data.items.map((pedido) => (
                            <article
                                key={pedido.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >

                                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">

                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-800">
                                            Pedido #{pedido.id}
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {new Date(pedido.created_at).toLocaleString("es-AR")}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {pedido.estado.replaceAll("_", " ")}
                                    </span>

                                </div>

                                <div className="mt-4 space-y-3">

                                    {pedido.items.map((item) => (
                                        <div
                                            key={item.producto_id}
                                            className="flex justify-between gap-4 text-sm"
                                        >

                                            <span className="text-slate-600">
                                                {item.nombre_producto} × {item.cantidad}
                                            </span>

                                            <span className="font-medium text-slate-800">
                                                {priceFormatter.format(item.subtotal)}
                                            </span>

                                        </div>
                                    ))}

                                </div>

                                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">

                                    <p>
                                        <span className="font-medium">
                                            Entrega:
                                        </span>{" "}
                                        {pedido.direccion_entrega}
                                    </p>

                                    <p>
                                        <span className="font-medium">
                                            Pago:
                                        </span>{" "}
                                        {pedido.forma_pago === "EFECTIVO"
                                            ? "Efectivo"
                                            : "Transferencia"}
                                    </p>

                                    {pedido.notas && (
                                        <p>
                                            <span className="font-medium">
                                                Notas:
                                            </span>{" "}
                                            {pedido.notas}
                                        </p>
                                    )}

                                </div>

                                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">

                                    <span className="text-lg font-bold text-teal-700">
                                        {priceFormatter.format(pedido.total)}
                                    </span>

                                    {pedido.estado === "PENDIENTE" && (
                                        <div>

                                            {pedidoAConfirmar === pedido.id ? (
                                                <div className="flex flex-wrap items-center gap-3">

                                                    <span className="text-sm text-slate-600">
                                                        ¿Cancelar este pedido?
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={cancelar.isPending}
                                                        onClick={() => void handleCancelar(pedido.id)}
                                                        className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                                                    >
                                                        Confirmar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={cancelar.isPending}
                                                        onClick={() => setPedidoAConfirmar(null)}
                                                        className="text-sm text-slate-600 hover:underline disabled:opacity-50"
                                                    >
                                                        Volver
                                                    </button>

                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setErrorCancelar(null)
                                                        setPedidoAConfirmar(pedido.id)
                                                    }}
                                                    className="text-sm font-medium text-red-600 hover:underline"
                                                >
                                                    Cancelar pedido
                                                </button>

                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav
                            aria-label="Paginación de pedidos"
                            className="mt-8 flex items-center justify-center gap-4"
                        >

                            <button
                                type="button"
                                disabled={page === 0}
                                onClick={() => setPage((current) => current - 1)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
                            >
                                Anterior
                            </button>

                            <span className="text-sm text-slate-600">
                                Página {page + 1} de {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage((current) => current + 1)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
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


export default MisPedidosPage