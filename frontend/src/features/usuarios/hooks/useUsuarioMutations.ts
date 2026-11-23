import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
    activarUsuario,
    desactivarUsuario
} from "../api/usuarios"


export function useActivarUsuario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: activarUsuario,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            })
        }
    })
}


export function useDesactivarUsuario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: desactivarUsuario,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            })
        }
    })
}