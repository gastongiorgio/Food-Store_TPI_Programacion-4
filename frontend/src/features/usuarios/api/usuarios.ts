import { axiosInstance } from "../../../shared/api/axiosInstance"

import type { User } from "../../auth/types/auth"


export async function getUsuarios(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>("/admin/usuarios")

    return response.data
}


export async function activarUsuario(usuarioId: number): Promise<User> {
    const response = await axiosInstance.post<User>(
        `/admin/usuarios/${usuarioId}/activar`
    )

    return response.data
}


export async function desactivarUsuario(usuarioId: number): Promise<User> {
    const response = await axiosInstance.post<User>(
        `/admin/usuarios/${usuarioId}/desactivar`
    )

    return response.data
}