import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "react-router-dom"

import { useAuthStore } from "../../../store/authStore"
import { handleApiError } from "../../../shared/api/handleApiError"


function LoginPage() {
    const navigate = useNavigate()

    const login = useAuthStore((state) => state.login)

    const [error, setError] = useState<string | null>(null)


    // TANSTACK FORM: FORMULARIO DE LOGIN
    const form = useForm({
        defaultValues: {
            username: "",
            password: ""
        },

        onSubmit: async ({ value }) => {
            setError(null)

            try {
                await login(value)
                navigate("/")
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
                        Iniciar sesión
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Ingresá tus datos para continuar
                    </p>

                </div>


                <form
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
                            onBlur: ({ value }) =>
                                !value.trim()
                                    ? "El usuario es obligatorio."
                                    : undefined,

                            onSubmit: ({ value }) =>
                                !value.trim()
                                    ? "El usuario es obligatorio."
                                    : undefined
                        }}
                    >
                        {(field) => (
                            <div>

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
                                    placeholder="Ingresá tu usuario"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => {
                                        field.handleChange(event.target.value)
                                        setError(null)
                                    }}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                />

                                {field.state.meta.errors.length > 0 && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {String(field.state.meta.errors[0])}
                                    </p>
                                )}

                            </div>
                        )}
                    </form.Field>


                    <form.Field
                        name="password"
                        validators={{
                            onBlur: ({ value }) =>
                                !value
                                    ? "La contraseña es obligatoria."
                                    : undefined,

                            onSubmit: ({ value }) =>
                                !value
                                    ? "La contraseña es obligatoria."
                                    : undefined
                        }}
                    >
                        {(field) => (
                            <div>

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
                                    autoComplete="current-password"
                                    placeholder="Ingresá tu contraseña"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => {
                                        field.handleChange(event.target.value)
                                        setError(null)
                                    }}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                />

                                {field.state.meta.errors.length > 0 && (
                                    <p className="mt-1 text-xs text-red-500">
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
                                    ? "Ingresando..."
                                    : "Iniciar sesión"}
                            </button>
                        )}
                    </form.Subscribe>

                </form>


                <p className="mt-6 text-center text-sm text-slate-500">
                    ¿No tenés una cuenta?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-teal-700 transition hover:text-teal-600 hover:underline"
                    >
                        Registrate
                    </Link>
                </p>

            </div>

        </section>
    )
}


export default LoginPage
