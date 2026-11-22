import { axiosInstance } from "../../../shared/api/axiosInstance"

import type { Categoria } from "../types/categorias"


export async function getCategories(): Promise<Categoria[]> {
    const response = await axiosInstance.get<Categoria[]>("/categorias")

    return response.data
}