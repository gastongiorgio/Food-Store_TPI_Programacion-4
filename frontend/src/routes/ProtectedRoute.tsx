import { Navigate, Outlet, useLocation } from "react-router-dom"

import type { UserRole } from "../features/auth/types/auth"
import { useAuthStore } from "../store/authStore"


interface ProtectedRouteProps {
    roles?: UserRole[]
}


function ProtectedRoute({ roles }: ProtectedRouteProps) {
    const location = useLocation()
    const usuario = useAuthStore((state) => state.usuario)
    const cargando = useAuthStore((state) => state.cargando)

    if (cargando) {
        return (
            <div
                className="flex flex-1 items-center justify-center py-16"
                role="status"
            >
                <p className="text-sm text-slate-600">
                    Verificando sesión...
                </p>
            </div>
        )
    }

    if (!usuario) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname + location.search
                }}
            />
        )
    }

    if (roles && !roles.includes(usuario.role)) {
        return (
            <Navigate to="/unauthorized" replace />
        )
    }

    return <Outlet />
}


export default ProtectedRoute