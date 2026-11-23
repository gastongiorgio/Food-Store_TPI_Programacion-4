import { axiosInstance } from "../../../shared/api/axiosInstance"

import type {
    Categoria,
    CategoriaCreate,
    CategoriaUpdate
} from "../types/categorias"


export async function getCategories(): Promise<Categoria[]> {
    const response = await axiosInstance.get<Categoria[]>("/categorias")

    return response.data
}

export async function getCategory(
    categoriaId: number
): Promise<Categoria> {
    const response = await axiosInstance.get<Categoria>(`/categorias/${categoriaId}`)

    return response.data
}

export async function createCategory(
    datos: CategoriaCreate
): Promise<Categoria> {
    const response = await axiosInstance.post<Categoria>("/categorias", datos)

    return response.data
}

export async function updateCategory(
    categoriaId: number,
    datos: CategoriaUpdate
): Promise<Categoria> {
    const response = await axiosInstance.put<Categoria>(`/categorias/${categoriaId}`, datos)

    return response.data
}

export async function deleteCategory(
    categoriaId: number
): Promise<void> {
    await axiosInstance.delete(`/categorias/${categoriaId}`)
}