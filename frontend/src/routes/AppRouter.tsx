import { Route, Routes } from "react-router-dom"

import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import CatalogoPage from "../features/productos/pages/CatalogoPage"
import CarritoPage from "../features/pedidos/pages/CarritoPage"
import CheckoutPage from "../features/pedidos/pages/CheckoutPage"
import MisPedidosPage from "../features/pedidos/pages/MisPedidosPage"

import MainLayout from "../shared/layout/MainLayout"
import ProtectedRoute from "./ProtectedRoute"


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

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/checkout"
                        element={<CheckoutPage />}
                    />

                    <Route
                        path="/mis-pedidos"
                        element={<MisPedidosPage />}
                    />

                </Route>

            </Routes>
        </MainLayout>
    )
}


export default AppRouter