import { Outlet } from "react-router-dom"

import Navbar from "./Navbar"


function MainLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-linear-to-b from-[#F8F7F2] via-[#F0F6F8] to-[#EAF1F5]">
            <Navbar />
            <main className="flex flex-1 flex-col">
                <Outlet />
            </main>
        </div>
    )
}


export default MainLayout