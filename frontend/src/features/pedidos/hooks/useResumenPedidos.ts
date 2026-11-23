import { useQuery } from "@tanstack/react-query"

import { getResumenPedidos } from "../api/pedidos"


export function useResumenPedidos() {
    return useQuery({
        queryKey: ["pedidos", "resumen"],
        queryFn: getResumenPedidos
    })
}
