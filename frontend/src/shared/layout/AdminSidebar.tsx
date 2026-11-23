import { Link, NavLink } from "react-router-dom"


function SidebarContent() {
    return (
        <div className="flex flex-col gap-5">

            <nav
                aria-label="Secciones de administración"
                className="flex flex-col gap-2"
            >

                <NavLink
                    to="/admin/resumen"
                    end
                    className={({ isActive }) =>
                        `rounded-xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-teal-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
                        }`
                    }
                >
                    <span className="flex items-center gap-3">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
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

                        Resumen

                    </span>
                </NavLink>

                <NavLink
                    to="/admin/categorias"
                    end
                    className={({ isActive }) =>
                        `rounded-xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-teal-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
                        }`
                    }
                >
                    <span className="flex items-center gap-3">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M20.59 13.41 11 3.83H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.83Z" />
                            <circle cx="7.5" cy="7.5" r="1" />
                        </svg>

                        Categorías

                    </span>
                </NavLink>

                <NavLink
                    to="/admin/productos"
                    end
                    className={({ isActive }) =>
                        `rounded-xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-teal-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
                        }`
                    }
                >
                    <span className="flex items-center gap-3">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                            <path d="M3 8v9l9 5 9-5V8" />
                            <path d="M12 13v9" />
                        </svg>

                        Productos

                    </span>
                </NavLink>

                <NavLink
                    to="/admin/pedidos"
                    end
                    className={({ isActive }) =>
                        `rounded-xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-teal-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
                        }`
                    }
                >
                    <span className="flex items-center gap-3">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M7 9h10" />
                            <path d="M7 13h10" />
                            <path d="M7 17h6" />
                        </svg>

                        Pedidos

                    </span>
                </NavLink>

                <NavLink
                    to="/admin/usuarios"
                    end
                    className={({ isActive }) =>
                        `rounded-xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-teal-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
                        }`
                    }
                >
                    <span className="flex items-center gap-3">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>

                        Usuarios

                    </span>
                </NavLink>

            </nav>

            <div className="border-t border-slate-200 pt-5">

                <Link
                    to="/"
                    className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg>

                    Volver al catálogo

                </Link>

            </div>
        </div>
    )
}


function AdminSidebar() {
    return (
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">

            <div className="p-4 lg:hidden">

                <details className="group">

                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                        Menú administrativo

                        <span
                            className="transition-transform group-open:rotate-180"
                            aria-hidden="true"
                        >
                            ▾
                        </span>
                    </summary>

                    <div className="pt-4">
                        <SidebarContent />
                    </div>

                </details>

            </div>

            <div className="hidden p-5 lg:block">

                <div className="mb-6 px-3">

                    <h2 className="text-lg font-bold text-slate-800">
                        Administración
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Gestión de Food Store
                    </p>

                </div>

                <SidebarContent />

            </div>

        </aside>
    )
}


export default AdminSidebar