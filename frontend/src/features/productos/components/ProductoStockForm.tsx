import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import type {
    Producto,
    ProductoStockUpdate
} from "../types/productos"

import { handleApiError } from "../../../shared/api/handleApiError"


interface ProductoStockFormProps {
    producto: Producto
    onGuardar: (datos: ProductoStockUpdate) => Promise<void>
    onCancelar: () => void
}


function validarStock(value: string): string | undefined {
    if (value.trim() === "") {
        return "El stock es obligatorio."
    }

    const stock = Number(value)

    if (!Number.isInteger(stock) || stock < 0) {
        return "El stock debe ser un número entero mayor o igual a cero."
    }

    return undefined
}


function ProductoStockForm({
    producto,
    onGuardar,
    onCancelar
}: ProductoStockFormProps) {
    const [error, setError] = useState<string | null>(null)

    const form = useForm({
        defaultValues: {
            stock: String(producto.stock),
            disponible: producto.disponible
        },

        onSubmit: async ({ value }) => {
            setError(null)

            const errorStock = validarStock(value.stock)

            if (errorStock) {
                setError(errorStock)
                return
            }

            const datos: ProductoStockUpdate = {
                stock: Number(value.stock),
                disponible: value.disponible
            }

            try {
                await onGuardar(datos)
            } catch (error) {
                setError(handleApiError(error))
            }
        }
    })


    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-800">
                    Gestionar stock y disponibilidad
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Producto:{" "}
                    <span className="font-semibold text-slate-700">
                        {producto.nombre}
                    </span>
                </p>

            </div>

            <form
                noValidate
                className="space-y-6"
                onSubmit={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    void form.handleSubmit()
                }}
            >

                <form.Field
                    name="stock"
                    validators={{
                        onChange: ({ value }) => validarStock(value)
                    }}
                >
                    {(field) => (
                        <div>

                            <label
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Stock disponible *
                            </label>

                            <input
                                id={field.name}
                                name={field.name}
                                type="number"
                                min="0"
                                step="1"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => {
                                    field.handleChange(event.target.value)
                                    setError(null)
                                }}
                                aria-invalid={
                                    field.state.meta.errors.length > 0
                                }
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                            />

                            {field.state.meta.errors.length > 0 && (
                                <p
                                    role="alert"
                                    className="mt-2 text-xs text-red-600"
                                >
                                    {String(field.state.meta.errors[0])}
                                </p>
                            )}

                        </div>
                    )}
                </form.Field>

                <form.Field name="disponible">
                    {(field) => (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <label className="flex cursor-pointer items-center gap-3">

                                <input
                                    name={field.name}
                                    type="checkbox"
                                    checked={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => {
                                        field.handleChange(event.target.checked)
                                        setError(null)
                                    }}
                                    className="h-4 w-4 accent-teal-600"
                                />

                                <span className="text-sm font-semibold text-slate-700">
                                    Disponible para la venta
                                </span>

                            </label>

                            <p className="mt-3 text-xs leading-relaxed text-slate-500">
                                Si desactivás esta opción, los clientes
                                no podrán agregar el producto al carrito,
                                aunque tenga stock.
                            </p>

                        </div>
                    )}
                </form.Field>

                <div className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3">

                    <p className="text-sm text-teal-800">
                        Un producto necesita estar activo, disponible
                        y tener stock mayor que cero para poder venderse.
                    </p>

                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <form.Subscribe
                    selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting
                    ]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={onCancelar}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={!canSubmit || isSubmitting}
                                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Guardando..."
                                    : "Guardar cambios"}
                            </button>

                        </div>
                    )}
                </form.Subscribe>

            </form>

        </div>
    )
}


export default ProductoStockForm