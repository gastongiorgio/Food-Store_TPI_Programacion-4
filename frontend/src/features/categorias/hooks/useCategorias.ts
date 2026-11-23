import { useQuery } from "@tanstack/react-query"

import { getCategories } from "../api/categorias"


export function useCategorias() {
    return useQuery({
        queryKey: ["categorias"],
        queryFn: getCategories
    })
}