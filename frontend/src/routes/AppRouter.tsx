import { Navigate, Route, Routes } from "react-router-dom"

import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage"

import CatalogoPage from "../features/productos/pages/CatalogoPage"

import CarritoPage from "../features/pedidos/pages/CarritoPage"
import CheckoutPage from "../features/pedidos/pages/CheckoutPage"
import MisPedidosPage from "../features/pedidos/pages/MisPedidosPage"
import AdminResumenPage from "../features/pedidos/pages/AdminResumenPage"

import MainLayout from "../shared/layout/MainLayout"
import AdminLayout from "../shared/layout/AdminLayout"
import ProtectedRoute from "./ProtectedRoute"


function AppRouter() {
    return (
        <Routes>

            {/* VISTA DE LA TIENDA */}
            <Route element={<MainLayout />}>

                {/* RUTAS PÚBLICAS */}
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

                <Route
                    path="/unauthorized"
                    element={<UnauthorizedPage />}
                />


                {/* RUTAS CON SESIÓN */}
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

            </Route>

            {/* VISTA ADMINISTRATIVA */}
            <Route
                element={<ProtectedRoute roles={["admin"]} />}
            >

                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="resumen"
                                replace
                            />
                        }
                    />

                    <Route
                        path="resumen"
                        element={<AdminResumenPage />}
                    />

                </Route>

            </Route>

        </Routes>
    )
}


export default AppRouter