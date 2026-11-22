import { Route, Routes } from "react-router-dom"

import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import MainLayout from "../shared/layout/MainLayout"
import { useAuthStore } from "../store/authStore"


function AppRouter() {
    const usuario = useAuthStore((state) => state.usuario)

    return (
        <MainLayout>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/"
                    element={
                        <section className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
                            <h1 className="text-3xl font-bold text-slate-800">
                                Catálogo de productos
                            </h1>

                            <p className="mt-3 text-slate-500">
                                Próximamente podrás explorar nuestros productos.
                            </p>

                            {usuario && (
                                <p className="mt-5 font-medium text-teal-700">
                                    Sesión iniciada: {usuario.full_name}
                                </p>
                            )}
                        </section>
                    }
                />
            </Routes>
        </MainLayout>
    )
}


export default AppRouter
