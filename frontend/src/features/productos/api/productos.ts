import { axiosInstance } from "../../../shared/api/axiosInstance"

import type {
    Producto,
    ProductoCreate,
    ProductoUpdate,
    ProductoStockUpdate,
    ProductosPaginados,
    ProductFilters
} from "../types/productos"


export async function getProducts(
    filters: ProductFilters = {}
): Promise<ProductosPaginados> {
    const response = await axiosInstance.get<ProductosPaginados>(
        "/productos",
        {
            params: filters
        }
    )

    return response.data
}


export async function getProduct(
    id: number
): Promise<Producto> {
    const response = await axiosInstance.get<Producto>(`/productos/${id}`)

    return response.data
}


export async function createProduct(
    datos: ProductoCreate
): Promise<Producto> {
    const response = await axiosInstance.post<Producto>("/productos", datos)

    return response.data
}


export async function updateProduct(
    productoId: number,
    datos: ProductoUpdate
): Promise<Producto> {
    const response = await axiosInstance.put<Producto>(`/productos/${productoId}`, datos)

    return response.data
}


export async function updateProductStock(
    productoId: number,
    datos: ProductoStockUpdate
): Promise<Producto> {
    const response = await axiosInstance.patch<Producto>(`/productos/${productoId}/stock`, datos)

    return response.data
}


export async function deleteProduct(
    productoId: number
): Promise<void> {
    await axiosInstance.delete(`/productos/${productoId}`)
}