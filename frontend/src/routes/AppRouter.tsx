import { Route, Routes } from "react-router-dom"

import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import CatalogoPage from "../features/productos/pages/CatalogoPage"
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

            </Routes>
        </MainLayout>
    )
}


export default AppRouter
