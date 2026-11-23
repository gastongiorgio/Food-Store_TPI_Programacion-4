import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
    createCategory,
    updateCategory,
    deleteCategory
} from "../api/categorias"

import type { CategoriaUpdate } from "../types/categorias"


interface ActualizarCategoriaVariables {
    categoriaId: number
    datos: CategoriaUpdate
}


export function useCrearCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createCategory,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["categorias"]
            })
        }
    })
}


export function useActualizarCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            categoriaId,
            datos
        }: ActualizarCategoriaVariables) =>
            updateCategory(categoriaId, datos),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["categorias"]
            })
        }
    })
}


export function useEliminarCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteCategory,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["categorias"]
            })
        }
    })
}