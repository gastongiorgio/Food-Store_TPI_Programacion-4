import { useResumenPedidos } from "../hooks/useResumenPedidos"
import { handleApiError } from "../../../shared/api/handleApiError"


const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})


const numberFormatter = new Intl.NumberFormat("es-AR")


interface TarjetaResumenProps {
    titulo: string
    valor: string
    descripcion: string
}


function TarjetaResumen({
    titulo,
    valor,
    descripcion
}: TarjetaResumenProps) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-sm font-semibold text-slate-600">
                {titulo}
            </h2>

            <p className="mt-4 text-3xl font-bold text-teal-700">
                {valor}
            </p>

            <p className="mt-3 text-xs text-slate-500">
                {descripcion}
            </p>

        </article>
    )
}


function AdminResumenPage() {
    const {
        data,
        isPending,
        isError,
        error,
        isFetching,
        refetch
    } = useResumenPedidos()


    return (
        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">

            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Resumen administrativo
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Consultá los indicadores de pedidos de Food Store.
                    </p>
                </div>

                <button
                    type="button"
                    disabled={isFetching}
                    onClick={() => void refetch()}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isFetching ? "Actualizando..." : "Actualizar"}
                </button>

            </div>

            {isPending ? (

                <div
                    role="status"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {Array.from({ length: 6 }, (_, index) => (
                        <div
                            key={index}
                            className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                        />
                    ))}

                    <span className="sr-only">
                        Cargando indicadores...
                    </span>
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

            ) : (

                <>
                    <h2 className="mb-4 text-lg font-semibold text-slate-800">
                        Estado de los pedidos
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <TarjetaResumen
                            titulo="Pendientes"
                            valor={numberFormatter.format(data.pendientes)}
                            descripcion="Pedidos pendientes de preparación"
                        />

                        <TarjetaResumen
                            titulo="En preparación"
                            valor={numberFormatter.format(data.en_preparacion)}
                            descripcion="Pedidos que se están preparando"
                        />

                        <TarjetaResumen
                            titulo="Entregados"
                            valor={numberFormatter.format(data.entregados)}
                            descripcion="Pedidos entregados"
                        />

                        <TarjetaResumen
                            titulo="Cancelados"
                            valor={numberFormatter.format(data.cancelados)}
                            descripcion="Pedidos cancelados"
                        />

                    </div>


                    <h2 className="mb-4 mt-10 text-lg font-semibold text-slate-800">
                        Actividad e ingresos
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">

                        <TarjetaResumen
                            titulo="Pedidos de hoy"
                            valor={numberFormatter.format(data.pedidos_hoy)}
                            descripcion="Pedidos creados durante el día"
                        />

                        <TarjetaResumen
                            titulo="Ingresos de pedidos entregados"
                            valor={priceFormatter.format(data.ingresos_entregados)}
                            descripcion="Suma de los importes de pedidos con estado ENTREGADO"
                        />

                    </div>
                </>
            )}

        </section>
    )
}


export default AdminResumenPage