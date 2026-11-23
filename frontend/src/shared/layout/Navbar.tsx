import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { handleApiError } from "../api/handleApiError"


function Navbar() {
    const navigate = useNavigate()

    const usuario = useAuthStore((state) => state.usuario)
    const cargando = useAuthStore((state) => state.cargando)
    const logout = useAuthStore((state) => state.logout)

    const cantidadCarrito = useCartStore(
        (state) => state.items.reduce(
            (total, item) => total + item.cantidad,
            0
        )
    )

    const [error, setError] = useState<string | null>(null)

    const handleLogout = async () => {
        setError(null)

        try {
            await logout()
            navigate("/login", { replace: true })
        } catch (error) {
            setError(handleApiError(error))
        }
    }

    return (
        <header className="border-b border-slate-700 bg-slate-800 shadow-sm">

            <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">

                <Link to="/" className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="23"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M4 3v7a3 3 0 0 0 6 0V3" />
                            <path d="M7 3v18" />
                            <path d="M20 21V3c-5 3-6 8-6 12h6" />
                        </svg>
                    </div>

                    <span className="text-xl font-bold tracking-tight text-white">
                        Food Store
                    </span>

                </Link>

                <nav className="flex items-center gap-3 sm:gap-5">

                    <Link
                        to="/"
                        className="hidden text-sm font-medium text-slate-200 transition hover:text-cyan-300 sm:block"
                    >
                        Catálogo
                    </Link>

                    <Link
                        to="/carrito"
                        aria-label={`Carrito, ${cantidadCarrito} unidades`}
                        className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-white transition hover:border-cyan-300 hover:text-cyan-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="21"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.5 13h12l2-9H6" />
                        </svg>

                        <span className="hidden sm:inline">
                            Carrito
                        </span>

                        <span className="flex min-w-6 items-center justify-center rounded-full bg-teal-600 px-1.5 py-0.5 text-xs font-bold text-white">
                            {cantidadCarrito}
                        </span>
                    </Link>

                    {!cargando && usuario && (
                        <Link
                            to="/mis-pedidos"
                            className="hidden text-sm font-medium text-slate-200 transition hover:text-cyan-300 md:inline"
                        >
                            Mis pedidos
                        </Link>
                    )}

                    {cargando ? (
                        <span className="text-sm text-slate-300">
                            Cargando...
                        </span>
                    ) : usuario ? (
                        <>
                            <div className="hidden text-right sm:block">

                                <p className="text-sm font-medium text-white">
                                    {usuario.full_name}
                                </p>

                                <p className="text-xs text-cyan-200">
                                    {usuario.role === "admin"
                                        ? "Administrador"
                                        : "Usuario"}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => void handleLogout()}
                                className="rounded-lg border border-slate-500 px-3 py-2 text-sm font-medium text-white transition hover:border-cyan-300 hover:text-cyan-200"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-500"
                        >
                            Ingresar
                        </Link>
                    )}

                </nav>

            </div>

            {error && (
                <p
                    role="alert"
                    className="px-4 pb-3 text-center text-sm text-red-200"
                >
                    {error}
                </p>
            )}

        </header>
    )
}


export default Navbar