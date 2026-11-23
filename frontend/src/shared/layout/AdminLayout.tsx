import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"

import { useAuthStore } from "../../store/authStore"
import { handleApiError } from "../api/handleApiError"
import AdminSidebar from "./AdminSidebar"


function AdminLayout() {
    const navigate = useNavigate()

    const usuario = useAuthStore((state) => state.usuario)
    const logout = useAuthStore((state) => state.logout)
    const cargando = useAuthStore((state) => state.cargando)

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
        <div className="flex min-h-screen flex-col bg-linear-to-b from-[#F8F7F2] via-[#F0F6F8] to-[#EAF1F5]">

            <header className="border-b border-slate-700 bg-slate-800 shadow-sm">

                <div className="flex min-h-16 w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">

                    <Link
                        to="/admin/resumen"
                        className="flex items-center gap-3"
                    >

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
                                <rect x="3" y="3" width="7" height="9" rx="1" />
                                <rect x="14" y="3" width="7" height="5" rx="1" />
                                <rect x="14" y="12" width="7" height="9" rx="1" />
                                <rect x="3" y="16" width="7" height="5" rx="1" />
                            </svg>

                        </div>


                        <div>

                            <p className="text-lg font-bold tracking-tight text-white">
                                Food Store
                            </p>

                            <p className="text-xs text-cyan-200">
                                Panel administrativo
                            </p>

                        </div>

                    </Link>

                    <div className="flex items-center gap-3 sm:gap-5">

                        <div className="text-right">

                            <p className="max-w-36 truncate text-xs font-semibold text-white sm:max-w-none sm:text-sm">
                                {usuario?.full_name}
                            </p>

                            <p className="text-xs text-cyan-200">
                                Administrador
                            </p>

                        </div>

                        <button
                            type="button"
                            disabled={cargando}
                            onClick={() => void handleLogout()}
                            className="rounded-lg border border-slate-500 px-3 py-2 text-xs font-medium text-white transition hover:border-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                        >
                            Cerrar sesión
                        </button>

                    </div>

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

            <div className="flex w-full flex-1 flex-col lg:flex-row">

                <AdminSidebar />

                <main className="flex min-w-0 flex-1 flex-col">

                    <Outlet />

                </main>

            </div>

        </div>
    )
}


export default AdminLayout