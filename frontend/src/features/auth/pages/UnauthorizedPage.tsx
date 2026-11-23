import { Link } from "react-router-dom"


function UnauthorizedPage() {
    return (
        <section className="flex flex-1 items-center justify-center px-4 py-10">

            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <div
                    className="mb-5 text-5xl"
                    aria-hidden="true"
                >
                    🔒
                </div>

                <h1 className="text-2xl font-bold text-slate-800">
                    Acceso no autorizado
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    No tenés permisos para acceder a esta sección.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
                >
                    Volver al catálogo
                </Link>

            </div>

        </section>
    )
}


export default UnauthorizedPage