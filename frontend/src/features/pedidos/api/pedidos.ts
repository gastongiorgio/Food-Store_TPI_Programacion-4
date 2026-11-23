import { axiosInstance } from "../../../shared/api/axiosInstance"

import type {
    Pedido,
    PedidoCreate,
    PedidosPaginados,
    ResumenPedidos
} from "../types/pedidos"


export async function crearPedido(
    datos: PedidoCreate
): Promise<Pedido> {
    const response = await axiosInstance.post<Pedido>(
        "/pedidos",
        datos
    )

    return response.data
}


export async function getPedidos(
    skip = 0,
    limit = 20
): Promise<PedidosPaginados> {
    const response = await axiosInstance.get<PedidosPaginados>(
        "/pedidos",
        {
            params: { skip, limit }
        }
    )

    return response.data
}


export async function cancelarPedido(
    pedidoId: number
): Promise<Pedido> {
    const response = await axiosInstance.patch<Pedido>(
        `/pedidos/${pedidoId}/cancelar`
    )

    return response.data
}


export async function getResumenPedidos(): Promise<ResumenPedidos> {
    const response = await axiosInstance.get<ResumenPedidos>(
        "/pedidos/resumen"
    )

    return response.data
}