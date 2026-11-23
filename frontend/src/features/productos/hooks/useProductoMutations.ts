import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { QueryClient } from "@tanstack/react-query"

import {
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct
} from "../api/productos"

import type {
    ProductoUpdate,
    ProductoStockUpdate
} from "../types/productos"


interface ActualizarProductoVariables {
    productoId: number
    datos: ProductoUpdate
}


interface ActualizarStockVariables {
    productoId: number
    datos: ProductoStockUpdate
}


async function invalidarProductos(queryClient: QueryClient): Promise<void> {
    await Promise.all([
        queryClient.invalidateQueries({
            queryKey: ["productos"]
        }),
        queryClient.invalidateQueries({
            queryKey: ["producto"]
        })
    ])
}


export function useCrearProducto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createProduct,

        onSuccess: async () => {
            await invalidarProductos(queryClient)
        }
    })
}


export function useActualizarProducto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            productoId,
            datos
        }: ActualizarProductoVariables) =>
            updateProduct(productoId, datos),

        onSuccess: async () => {
            await invalidarProductos(queryClient)
        }
    })
}


export function useActualizarStock() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            productoId,
            datos
        }: ActualizarStockVariables) =>
            updateProductStock(productoId, datos),

        onSuccess: async () => {
            await invalidarProductos(queryClient)
        }
    })
}


export function useEliminarProducto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteProduct,

        onSuccess: async () => {
            await invalidarProductos(queryClient)
        }
    })
}