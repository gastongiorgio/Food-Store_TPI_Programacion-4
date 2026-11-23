import { useQueries } from "@tanstack/react-query"
import { Link } from "react-router-dom"

import { getProduct } from "../../productos/api/productos"
import { useCartStore } from "../../../store/cartStore"


const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})


function CarritoPage() {
    const items = useCartStore((state) => state.items)
    const quitar = useCartStore((state) => state.quitar)
    const cambiarCantidad = useCartStore(
        (state) => state.cambiarCantidad
    )
    const vaciar = useCartStore((state) => state.vaciar)
    const total = useCartStore((state) => state.total())

    const cantidadTotal = items.reduce(
        (acumulado, item) => acumulado + item.cantidad,
        0
    )

    const consultasProductos = useQueries({
        queries: items.map((item) => ({
            queryKey: ["producto", item.producto_id],
            queryFn: () => getProduct(item.producto_id)
        }))
    })


    return (
        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Mi carrito
                </h1>

                <p className="mt-2 text-slate-500">
                    Revisá los productos y las cantidades de tu pedido.
                </p>
            </div>


            {items.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                    <div className="mb-4 text-5xl" aria-hidden="true">
                        🛒
                    </div>

                    <h2 className="text-xl font-semibold text-slate-800">
                        Tu carrito está vacío
                    </h2>

                    <p className="mt-3 text-sm text-slate-500">
                        Todavía no agregaste ningún producto.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
                    >
                        Ver catálogo
                    </Link>

                </div>

            ) : (

                <div className="grid items-start gap-6 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">

                        {items.map((item, index) => {
                            const consulta = consultasProductos[index]
                            const productoActual = consulta?.data

                            const puedeIncrementar = Boolean(
                                productoActual?.activo &&
                                productoActual.disponible &&
                                item.cantidad < productoActual.stock
                            )

                            const stockInsuficiente = Boolean(
                                productoActual &&
                                item.cantidad > productoActual.stock
                            )

                            const subtotal = item.precio_unitario * item.cantidad

                            return (
                                <article
                                    key={item.producto_id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >

                                    <div className="flex flex-wrap items-start justify-between gap-4">

                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-800">
                                                {item.nombre}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Precio unitario:{" "}
                                                {priceFormatter.format(item.precio_unitario)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => quitar(item.producto_id)}
                                            className="text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline"
                                        >
                                            Quitar
                                        </button>

                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                                        <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">

                                            <button
                                                type="button"
                                                aria-label={`Disminuir cantidad de ${item.nombre}`}
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        item.producto_id,
                                                        item.cantidad - 1
                                                    )
                                                }
                                                className="px-4 py-2 text-lg font-medium text-slate-700 transition hover:bg-slate-100"
                                            >
                                                −
                                            </button>

                                            <span className="min-w-10 text-center text-sm font-semibold text-slate-800">
                                                {item.cantidad}
                                            </span>

                                            <button
                                                type="button"
                                                aria-label={`Aumentar cantidad de ${item.nombre}`}
                                                disabled={!puedeIncrementar}
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        item.producto_id,
                                                        item.cantidad + 1
                                                    )
                                                }
                                                className="px-4 py-2 text-lg font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                                            >
                                                +
                                            </button>

                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">
                                                Subtotal
                                            </p>

                                            <p className="text-lg font-bold text-slate-800">
                                                {priceFormatter.format(subtotal)}
                                            </p>
                                        </div>

                                    </div>


                                    {consulta?.isPending && (
                                        <p className="mt-3 text-xs text-slate-500">
                                            Consultando disponibilidad...
                                        </p>
                                    )}

                                    {consulta?.isError && (
                                        <p className="mt-3 text-xs text-red-600">
                                            No se pudo comprobar la disponibilidad.
                                        </p>
                                    )}

                                    {productoActual && !productoActual.disponible && (
                                        <p className="mt-3 text-xs text-red-600">
                                            Este producto ya no está disponible.
                                        </p>
                                    )}

                                    {stockInsuficiente && (
                                        <p className="mt-3 text-xs text-red-600">
                                            La cantidad supera el stock disponible.
                                        </p>
                                    )}

                                </article>
                            )
                        })}

                        <div className="flex flex-wrap items-center justify-between gap-4">

                            <Link
                                to="/"
                                className="text-sm font-medium text-teal-700 transition hover:underline"
                            >
                                ← Seguir comprando
                            </Link>

                            <button
                                type="button"
                                onClick={vaciar}
                                className="text-sm font-medium text-red-600 transition hover:underline"
                            >
                                Vaciar carrito
                            </button>

                        </div>

                    </div>

                    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-slate-800">
                            Resumen del carrito
                        </h2>

                        <div className="mt-5 space-y-4">

                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Unidades</span>
                                <span>{cantidadTotal}</span>
                            </div>

                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Productos diferentes</span>
                                <span>{items.length}</span>
                            </div>

                            <div className="border-t border-slate-200 pt-4">

                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold text-slate-800">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-teal-700">
                                        {priceFormatter.format(total)}
                                    </span>
                                </div>

                            </div>

                        </div>

                        <p className="mt-6 text-xs leading-relaxed text-slate-500">
                            Los precios y el stock se validarán nuevamente al confirmar el pedido.
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                            La confirmación del pedido se incorporará en la próxima etapa.
                        </p>

                    </aside>
                </div>
            )}
        </section>
    )
}


export default CarritoPage