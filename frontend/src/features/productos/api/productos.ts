import { axiosInstance } from "../../../shared/api/axiosInstance"

import type {
    Producto,
    ProductosPaginados,
    ProductFilters
} from "../types/productos"


export async function getProducts(filters: ProductFilters = {}): Promise<ProductosPaginados> {
    const response = await axiosInstance.get<ProductosPaginados>(
        "/productos",
        {
            params: filters
        }
    )

    return response.data
}


export async function getProduct(id: number): Promise<Producto> {
    const response = await axiosInstance.get<Producto>(`/productos/${id}`)

    return response.data
}