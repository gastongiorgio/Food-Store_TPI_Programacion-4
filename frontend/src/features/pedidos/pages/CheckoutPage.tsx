import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "react-router-dom"

import { useCartStore } from "../../../store/cartStore"
import { handleApiError } from "../../../shared/api/handleApiError"
import { useCrearPedido } from "../hooks/useCrearPedido"
import type { FormaPago } from "../types/pedidos"


const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})

function validarDireccion(value: string): string | undefined {
    const direccion = value.trim()

    if (direccion.length < 5) {
        return "La dirección debe tener al menos 5 caracteres."
    }

    if (direccion.length > 200) {
        return "La dirección no puede superar los 200 caracteres."
    }

    return undefined
}

function CheckoutPage() {
    const navigate = useNavigate()

    const items = useCartStore((state) => state.items)
    const vaciar = useCartStore((state) => state.vaciar)
    const total = useCartStore((state) => state.total())

    const crearPedido = useCrearPedido()

    const [error, setError] = useState<string | null>(null)


    // TANSTACK FORM: DATOS DE ENTREGA Y PAGO
    const form = useForm({
        defaultValues: {
            direccion_entrega: "",
            forma_pago: "EFECTIVO" as FormaPago,
            notas: ""
        },

        onSubmit: async ({ value }) => {
            setError(null)

            if (items.length === 0) {
                setError("El carrito está vacío.")
                return
            }

            try {
                const pedido = await crearPedido.mutateAsync({
                    items: items.map((item) => ({
                        producto_id: item.producto_id,
                        cantidad: item.cantidad
                    })),
                    forma_pago: value.forma_pago,
                    direccion_entrega: value.direccion_entrega.trim(),
                    notas: value.notas.trim() || null
                })

                vaciar()

                navigate("/mis-pedidos", {
                    replace: true,
                    state: {
                        pedidoCreado: pedido.id
                    }
                })
            } catch (error) {
                setError(handleApiError(error))
            }
        }
    })

    if (items.length === 0) {
        return (
            <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">

                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <h1 className="text-2xl font-bold text-slate-800">
                        No hay productos para confirmar
                    </h1>

                    <p className="mt-3 text-slate-500">
                        Agregá productos al carrito antes de crear un pedido.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-3 font-medium text-white hover:bg-teal-500"
                    >
                        Ver catálogo
                    </Link>

                </div>

            </section>
        )
    }

    return (
        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-800">
                    Confirmar pedido
                </h1>

                <p className="mt-2 text-slate-500">
                    Completá los datos de entrega y elegí cómo vas a pagar.
                </p>

            </div>

            <div className="grid items-start gap-6 lg:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

                    <form
                        className="space-y-6"
                        onSubmit={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            void form.handleSubmit()
                        }}
                    >

                        <form.Field
                            name="direccion_entrega"
                            validators={{
                                onBlur: ({ value }) => validarDireccion(value),
                                onSubmit: ({ value }) => validarDireccion(value)
                            }}
                        >
                            {(field) => (
                                <div>

                                    <label
                                        htmlFor={field.name}
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Dirección de entrega
                                    </label>

                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        autoComplete="street-address"
                                        maxLength={200}
                                        placeholder="Ej.: San Martín 1234, Mendoza"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(event) => {
                                            field.handleChange(event.target.value)
                                            setError(null)
                                        }}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                    />

                                    {field.state.meta.errors.length > 0 && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    )}

                                </div>
                            )}
                        </form.Field>

                        <form.Field name="forma_pago">
                            {(field) => (
                                <div>

                                    <label
                                        htmlFor={field.name}
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Forma de pago
                                    </label>

                                    <select
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(event) => {
                                            field.handleChange(event.target.value as FormaPago)
                                        }}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                    >
                                        <option value="EFECTIVO">
                                            Efectivo
                                        </option>

                                        <option value="TRANSFERENCIA">
                                            Transferencia
                                        </option>
                                    </select>

                                </div>
                            )}
                        </form.Field>


                        <form.Field name="notas">
                            {(field) => (
                                <div>

                                    <label
                                        htmlFor={field.name}
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Notas adicionales (opcional)
                                    </label>

                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        rows={4}
                                        placeholder="Indicaciones para la entrega..."
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(event) => {
                                            field.handleChange(event.target.value)
                                            setError(null)
                                        }}
                                        className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                    />

                                </div>
                            )}
                        </form.Field>


                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}


                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">

                            <Link
                                to="/carrito"
                                className="text-sm font-medium text-teal-700 hover:underline"
                            >
                                ← Volver al carrito
                            </Link>


                            <form.Subscribe
                                selector={(state) => [
                                    state.canSubmit,
                                    state.isSubmitting
                                ]}
                            >
                                {([canSubmit, isSubmitting]) => (
                                    <button
                                        type="submit"
                                        disabled={
                                            !canSubmit ||
                                            isSubmitting ||
                                            crearPedido.isPending
                                        }
                                        className="rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting || crearPedido.isPending
                                            ? "Confirmando..."
                                            : "Confirmar pedido"}
                                    </button>
                                )}
                            </form.Subscribe>

                        </div>

                    </form>

                </div>

                <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-800">
                        Resumen de compra
                    </h2>

                    <div className="mt-5 space-y-4">

                        {items.map((item) => (
                            <div
                                key={item.producto_id}
                                className="border-b border-slate-100 pb-4"
                            >

                                <p className="text-sm font-medium text-slate-800">
                                    {item.nombre}
                                </p>

                                <div className="mt-1 flex justify-between gap-3 text-xs text-slate-500">

                                    <span>
                                        Cantidad: {item.cantidad}
                                    </span>

                                    <span>
                                        {priceFormatter.format(
                                            item.precio_unitario * item.cantidad
                                        )}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">

                        <span className="font-semibold text-slate-800">
                            Total estimado
                        </span>

                        <span className="text-xl font-bold text-teal-700">
                            {priceFormatter.format(total)}
                        </span>

                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                        El backend calculará el importe definitivo
                        con los precios vigentes y validará el stock
                        al confirmar el pedido.
                    </p>

                </aside>

            </div>

        </section>
    )
}


export default CheckoutPage