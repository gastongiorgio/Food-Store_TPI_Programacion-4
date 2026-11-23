import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import type {
    Categoria,
    CategoriaCreate
} from "../types/categorias"

import { handleApiError } from "../../../shared/api/handleApiError"


interface CategoriaFormProps {
    categoria?: Categoria | null
    onGuardar: (datos: CategoriaCreate) => Promise<void>
    onCancelar: () => void
}


function validarNombre(value: string): string | undefined {
    const nombre = value.trim()

    if (!nombre) {
        return "El nombre es obligatorio."
    }

    if (nombre.length < 2) {
        return "El nombre debe tener al menos 2 caracteres."
    }

    if (nombre.length > 100) {
        return "El nombre no puede superar los 100 caracteres."
    }

    return undefined
}


function CategoriaForm({
    categoria,
    onGuardar,
    onCancelar
}: CategoriaFormProps) {

    const [error, setError] = useState<string | null>(null)
    const esEdicion = categoria !== undefined && categoria !== null

    // TANSTACK FORM
    const form = useForm({
        defaultValues: {
            nombre: categoria?.nombre ?? "",
            descripcion: categoria?.descripcion ?? ""
        },

        onSubmit: async ({ value }) => {
            setError(null)

            const datos: CategoriaCreate = {
                nombre: value.nombre.trim(),
                descripcion: value.descripcion.trim() || null
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
                    {esEdicion
                        ? "Editar categoría"
                        : "Nueva categoría"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    {esEdicion
                        ? "Modificá los datos de la categoría seleccionada."
                        : "Completá los datos para registrar una categoría."}
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
                        onChange: ({ value }) =>
                            validarNombre(value)
                    }}
                >
                    {(field) => (
                        <div>

                            <label
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Nombre
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id={field.name}
                                name={field.name}
                                type="text"
                                maxLength={100}
                                placeholder="Ej.: Hamburguesas"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => {
                                    field.handleChange(event.target.value)
                                    setError(null)
                                }}
                                aria-invalid={
                                    field.state.meta.errors.length > 0
                                }
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
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

                <form.Field name="descripcion">
                    {(field) => (
                        <div>

                            <label
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Descripción
                                <span className="ml-2 text-xs font-normal text-slate-400">
                                    Opcional
                                </span>
                            </label>

                            <textarea
                                id={field.name}
                                name={field.name}
                                rows={4}
                                placeholder="Describí brevemente la categoría..."
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => {
                                    field.handleChange(event.target.value)
                                    setError(null)
                                }}
                                className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
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
                                    : esEdicion
                                        ? "Guardar cambios"
                                        : "Crear categoría"}
                            </button>

                        </div>
                    )}
                </form.Subscribe>

            </form>

        </div>
    )
}


export default CategoriaForm