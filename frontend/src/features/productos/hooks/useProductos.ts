import { useQuery } from "@tanstack/react-query"

import { getProducts } from "../api/productos"
import type { ProductFilters } from "../types/productos"


export function useProductos(filters: ProductFilters = {}) {
    return useQuery({
        queryKey: ["productos", filters],
        queryFn: () => getProducts(filters)
    })
}