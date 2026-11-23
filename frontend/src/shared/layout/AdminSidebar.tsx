import { Link, NavLink } from "react-router-dom"


const seccionesPendientes = [
    "Categorías",
    "Productos",
    "Pedidos",
    "Usuarios"
]


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

                <p className="px-4 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Próximamente
                </p>

                {seccionesPendientes.map((seccion) => (
                    <div
                        key={seccion}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400"
                        aria-disabled="true"
                    >
                        <span
                            className="h-2 w-2 rounded-full bg-slate-300"
                            aria-hidden="true"
                        />

                        {seccion}
                    </div>
                ))}

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