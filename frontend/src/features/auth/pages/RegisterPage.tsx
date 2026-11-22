import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Link } from "react-router-dom"

import { register } from "../api/auth"
import { handleApiError } from "../../../shared/api/handleApiError"


function validateRequired(value: string, message: string): string | undefined {
    return value.trim() ? undefined : message
}


function validateEmail(value: string): string | undefined {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailPattern.test(value)
        ? undefined
        : "Ingresá un email válido."
}


function validatePassword(value: string): string | undefined {
    if (value.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres."
    }

    if (new TextEncoder().encode(value).length > 72) {
        return "La contraseña es demasiado larga."
    }

    return undefined
}


function RegisterPage() {
    const [error, setError] = useState<string | null>(null)
    const [registered, setRegistered] = useState(false)


    const form = useForm({
        defaultValues: {
            username: "",
            full_name: "",
            email: "",
            password: ""
        },

        onSubmit: async ({ value }) => {
            setError(null)

            try {
                await register(value)
                setRegistered(true)
            } catch (error) {
                setError(handleApiError(error))
            }
        }
    })


    return (
        <section className="flex flex-1 items-center justify-center px-4 py-10">

            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-8 text-center">

                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        Crear cuenta
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Completá tus datos para registrarte
                    </p>

                </div>


                {registered ? (
                    <div className="space-y-5 text-center">

                        <p
                            role="status"
                            className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800"
                        >
                            Tu cuenta fue creada correctamente.
                        </p>

                        <Link
                            to="/login"
                            className="block rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white transition hover:bg-teal-500"
                        >
                            Ir a iniciar sesión
                        </Link>

                    </div>
                ) : (
                    <>

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
                                name="username"
                                validators={{
                                    onChange: ({ value }) =>
                                        validateRequired(
                                            value,
                                            "El usuario es obligatorio."
                                        )
                                }}
                            >
                                {(field) => (
                                    <div className="group">

                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block text-sm font-medium text-slate-600"
                                        >
                                            Usuario
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            autoComplete="username"
                                            placeholder="Elegí un nombre de usuario"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(event) => {
                                                field.handleChange(event.target.value)
                                                setError(null)
                                            }}
                                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                        />

                                        {field.state.meta.errors.length > 0 && (
                                            <p
                                                role="alert"
                                                className="mt-1 text-xs text-red-500 group-focus-within:hidden"
                                            >
                                                {String(field.state.meta.errors[0])}
                                            </p>
                                        )}

                                    </div>
                                )}
                            </form.Field>


                            <form.Field
                                name="full_name"
                                validators={{
                                    onChange: ({ value }) =>
                                        validateRequired(
                                            value,
                                            "El nombre completo es obligatorio."
                                        )
                                }}
                            >
                                {(field) => (
                                    <div className="group">

                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block text-sm font-medium text-slate-600"
                                        >
                                            Nombre completo
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Ingresá tu nombre completo"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(event) => {
                                                field.handleChange(event.target.value)
                                                setError(null)
                                            }}
                                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                        />

                                        {field.state.meta.errors.length > 0 && (
                                            <p
                                                role="alert"
                                                className="mt-1 text-xs text-red-500 group-focus-within:hidden"
                                            >
                                                {String(field.state.meta.errors[0])}
                                            </p>
                                        )}

                                    </div>
                                )}
                            </form.Field>


                            <form.Field
                                name="email"
                                validators={{
                                    onChange: ({ value }) =>
                                        validateEmail(value)
                                }}
                            >
                                {(field) => (
                                    <div className="group">

                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block text-sm font-medium text-slate-600"
                                        >
                                            Email
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            autoComplete="email"
                                            placeholder="nombre@ejemplo.com"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(event) => {
                                                field.handleChange(event.target.value)
                                                setError(null)
                                            }}
                                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                        />

                                        {field.state.meta.errors.length > 0 && (
                                            <p
                                                role="alert"
                                                className="mt-1 text-xs text-red-500 group-focus-within:hidden"
                                            >
                                                {String(field.state.meta.errors[0])}
                                            </p>
                                        )}

                                    </div>
                                )}
                            </form.Field>


                            <form.Field
                                name="password"
                                validators={{
                                    onChange: ({ value }) =>
                                        validatePassword(value)
                                }}
                            >
                                {(field) => (
                                    <div className="group">

                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block text-sm font-medium text-slate-600"
                                        >
                                            Contraseña
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(event) => {
                                                field.handleChange(event.target.value)
                                                setError(null)
                                            }}
                                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                        />

                                        {field.state.meta.errors.length > 0 && (
                                            <p
                                                role="alert"
                                                className="mt-1 text-xs text-red-500 group-focus-within:hidden"
                                            >
                                                {String(field.state.meta.errors[0])}
                                            </p>
                                        )}

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
                                    <button
                                        type="submit"
                                        disabled={!canSubmit || isSubmitting}
                                        className="w-full rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting
                                            ? "Registrando..."
                                            : "Crear cuenta"}
                                    </button>
                                )}
                            </form.Subscribe>

                        </form>


                        <p className="mt-6 text-center text-sm text-slate-500">
                            ¿Ya tenés una cuenta?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-teal-700 transition hover:text-teal-600 hover:underline"
                            >
                                Iniciá sesión
                            </Link>
                        </p>

                    </>
                )}

            </div>

        </section>
    )
}


export default RegisterPage
