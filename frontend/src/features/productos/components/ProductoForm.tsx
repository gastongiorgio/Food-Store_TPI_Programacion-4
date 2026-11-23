import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import type { Categoria } from "../../categorias/types/categorias"

import type {
    Producto,
    ProductoCreate,
    ProductoUpdate
} from "../types/productos"

import { handleApiError } from "../../../shared/api/handleApiError"


interface ProductoFormProps {
    producto?: Producto | null
    categorias: Categoria[]
    onCrear: (datos: ProductoCreate) => Promise<void>
    onActualizar: (datos: ProductoUpdate) => Promise<void>
    onCancelar: () => void
}


function validarNombre(value: string): string | undefined {
    if (!value.trim()) {
        return "El nombre es obligatorio."
    }

    return undefined
}


function validarPrecio(value: string): string | undefined {
    if (value.trim() === "") {
        return "El precio es obligatorio."
    }

    const precio = Number(value)

    if (!Number.isFinite(precio) || precio < 0) {
        return "Ingresá un precio válido, mayor o igual a cero."
    }

    return undefined
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


function validarCategoria(value: string): string | undefined {
    if (
        value.trim() === "" ||
        !Number.isInteger(Number(value)) ||
        Number(value) <= 0
    ) {
        return "Seleccioná una categoría."
    }

    return undefined
}


function ProductoForm({
    producto,
    categorias,
    onCrear,
    onActualizar,
    onCancelar
}: ProductoFormProps) {
    const [error, setError] = useState<string | null>(null)

    const esEdicion = producto !== undefined && producto !== null

    const categoriaInactiva = producto &&
        !categorias.some(
            (categoria) => categoria.id === producto.categoria_id
        )

    const form = useForm({
        defaultValues: {
            nombre: producto?.nombre ?? "",
            descripcion: producto?.descripcion ?? "",
            precio_base: producto
                ? String(producto.precio_base)
                : "",
            imagen_url: producto?.imagen_url ?? "",
            categoria_id: producto
                ? String(producto.categoria_id)
                : "",
            stock: producto ? String(producto.stock) : "0",
            disponible: producto?.disponible ?? true
        },

        onSubmit: async ({ value }) => {
            setError(null)

            if (
                validarNombre(value.nombre) ||
                validarPrecio(value.precio_base) ||
                validarCategoria(value.categoria_id) ||
                (!esEdicion && validarStock(value.stock))
            ) {
                setError("Revisá los campos del formulario.")
                return
            }

            const datos = {
                nombre: value.nombre.trim(),
                descripcion: value.descripcion.trim() || null,
                precio_base: Number(value.precio_base),
                imagen_url: value.imagen_url.trim() || null
            }

            try {
                if (producto) {
                    const datosActualizacion: ProductoUpdate = {
                        ...datos
                    }

                    const categoriaId = Number(value.categoria_id)

                    if (categoriaId !== producto.categoria_id) {
                        datosActualizacion.categoria_id = categoriaId
                    }

                    await onActualizar(datosActualizacion)
                } else {
                    const datosCreacion: ProductoCreate = {
                        ...datos,
                        categoria_id: Number(value.categoria_id),
                        stock: Number(value.stock),
                        disponible: value.disponible
                    }

                    await onCrear(datosCreacion)
                }
            } catch (error) {
                setError(handleApiError(error))
            }
        }
    })


    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-800">
                    {esEdicion ? "Editar producto" : "Nuevo producto"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    {esEdicion
                        ? "Modificá los datos del producto seleccionado."
                        : "Completá los datos para registrar un producto."}
                </p>

            </div>

            <form
                noValidate
                className="space-y-5"
                onSubmit={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    void form.handleSubmit()
                }}
            >

                <form.Field
                    name="nombre"
                    validators={{
                        onChange: ({ value }) => validarNombre(value)
                    }}
                >
                    {(field) => (
                        <div>

                            <label
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Nombre *
                            </label>

                            <input
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="Ej.: Hamburguesa completa"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => {
                                    field.handleChange(event.target.value)
                                    setError(null)
                                }}
                                aria-invalid={field.state.meta.errors.length > 0}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                            />

                            {field.state.meta.errors.length > 0 && (
                                <p role="alert" className="mt-2 text-xs text-red-600">
                                    {String(field.state.meta.errors[0])}
                                </p>
                            )}

                        </div>
                    )}
                </form.Field>

                <form.Field name="descripcion">
                    {(field) => (
                        <div>

                            <label
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Descripción
                            </label>

                            <textarea
                                id={field.name}
                                name={field.name}
                                rows={3}
                                placeholder="Descripción del producto..."
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => {
                                    field.handleChange(event.target.value)
                                    setError(null)
                                }}
                                className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                            />

                        </div>
                    )}
                </form.Field>

                <div className="grid gap-5 sm:grid-cols-2">

                    <form.Field
                        name="precio_base"
                        validators={{
                            onChange: ({ value }) => validarPrecio(value)
                        }}
                    >
                        {(field) => (
                            <div>

                                <label
                                    htmlFor={field.name}
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Precio base ($) *
                                </label>

                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="Ej.: 8500"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => {
                                        field.handleChange(event.target.value)
                                        setError(null)
                                    }}
                                    aria-invalid={field.state.meta.errors.length > 0}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                />

                                {field.state.meta.errors.length > 0 && (
                                    <p role="alert" className="mt-2 text-xs text-red-600">
                                        {String(field.state.meta.errors[0])}
                                    </p>
                                )}

                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="categoria_id"
                        validators={{
                            onChange: ({ value }) => validarCategoria(value)
                        }}
                    >
                        {(field) => (
                            <div>

                                <label
                                    htmlFor={field.name}
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Categoría *
                                </label>

                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => {
                                        field.handleChange(event.target.value)
                                        setError(null)
                                    }}
                                    aria-invalid={field.state.meta.errors.length > 0}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                >

                                    <option value="">
                                        Seleccioná una categoría
                                    </option>

                                    {categoriaInactiva && producto && (
                                        <option
                                            value={producto.categoria_id}
                                            disabled
                                        >
                                            {producto.categoria.nombre} (inactiva)
                                        </option>
                                    )}

                                    {categorias.map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.nombre}
                                        </option>
                                    ))}

                                </select>

                                {field.state.meta.errors.length > 0 && (
                                    <p role="alert" className="mt-2 text-xs text-red-600">
                                        {String(field.state.meta.errors[0])}
                                    </p>
                                )}

                            </div>
                        )}
                    </form.Field>

                </div>

                <form.Field name="imagen_url">
                    {(field) => (
                        <div>

                            <label
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                URL de la imagen
                            </label>

                            <input
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => {
                                    field.handleChange(event.target.value)
                                    setError(null)
                                }}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Opcional. Si no ingresás una imagen,
                                el catálogo mostrará una imagen alternativa.
                            </p>

                        </div>
                    )}
                </form.Field>

                {!esEdicion && (
                    <div className="grid gap-5 sm:grid-cols-2">

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
                                        Stock inicial *
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
                                        aria-invalid={field.state.meta.errors.length > 0}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                    />

                                    {field.state.meta.errors.length > 0 && (
                                        <p role="alert" className="mt-2 text-xs text-red-600">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    )}

                                </div>
                            )}
                        </form.Field>

                        <form.Field name="disponible">
                            {(field) => (
                                <div className="flex flex-col justify-center">

                                    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">

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

                                        Disponible para la venta

                                    </label>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Podés modificar la disponibilidad
                                        desde la administración de stock.
                                    </p>

                                </div>
                            )}
                        </form.Field>

                    </div>
                )}

                {esEdicion && (
                    <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        El stock y la disponibilidad se modifican
                        desde la gestión de existencias del producto.
                    </p>
                )}

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
                                disabled={
                                    !canSubmit ||
                                    isSubmitting ||
                                    (!esEdicion && categorias.length === 0)
                                }
                                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Guardando..."
                                    : esEdicion
                                        ? "Guardar cambios"
                                        : "Crear producto"}
                            </button>

                        </div>
                    )}
                </form.Subscribe>

            </form>

        </div>
    )
}


export default ProductoForm