import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cambiarEstadoPedido } from "../api/pedidos"
import type { EstadoPedido } from "../types/pedidos"


interface CambiarEstadoVariables {
    pedidoId: number
    estado: EstadoPedido
}


export function useCambiarEstadoPedido() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            pedidoId,
            estado
        }: CambiarEstadoVariables) =>
            cambiarEstadoPedido(pedidoId, estado),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["pedidos"]
                }),
                queryClient.invalidateQueries({
                    queryKey: ["productos"]
                }),
                queryClient.invalidateQueries({
                    queryKey: ["producto"]
                })
            ])
        }
    })
}