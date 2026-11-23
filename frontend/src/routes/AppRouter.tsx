import { Route, Routes } from "react-router-dom"

import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import CatalogoPage from "../features/productos/pages/CatalogoPage"
import CarritoPage from "../features/pedidos/pages/CarritoPage"
import MainLayout from "../shared/layout/MainLayout"


function AppRouter() {
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
                    element={<CatalogoPage />}
                />

                <Route
                    path="/carrito"
                    element={<CarritoPage />}
                />

            </Routes>
        </MainLayout>
    )
}


export default AppRouter