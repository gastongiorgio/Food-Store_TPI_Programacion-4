import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Producto } from "../features/productos/types/productos"


export interface CartItem {
    producto_id: number
    nombre: string
    precio_unitario: number
    cantidad: number
}


interface CartState {
    items: CartItem[]

    agregar: (producto: Producto) => void
    quitar: (producto_id: number) => void
    cambiarCantidad: (producto_id: number, cantidad: number) => void
    vaciar: () => void
    total: () => number
}


export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            agregar: (producto) => {
                if (
                    !producto.activo ||
                    !producto.disponible ||
                    producto.stock <= 0
                ) {
                    return
                }

                set((state) => {
                    const itemExistente = state.items.find(
                        (item) => item.producto_id === producto.id
                    )

                    if (itemExistente) {
                        if (itemExistente.cantidad >= producto.stock) {
                            return state
                        }

                        return {
                            items: state.items.map((item) =>
                                item.producto_id === producto.id
                                    ? {
                                        ...item,
                                        cantidad: item.cantidad + 1
                                    }
                                    : item
                            )
                        }
                    }

                    const nuevoItem: CartItem = {
                        producto_id: producto.id,
                        nombre: producto.nombre,
                        precio_unitario: producto.precio_base,
                        cantidad: 1
                    }

                    return {
                        items: [...state.items, nuevoItem]
                    }
                })
            },

            quitar: (producto_id) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => item.producto_id !== producto_id
                    )
                }))
            },

            cambiarCantidad: (producto_id, cantidad) => {
                if (!Number.isInteger(cantidad) || cantidad < 0) {
                    return
                }

                set((state) => ({
                    items: cantidad === 0
                        ? state.items.filter(
                            (item) => item.producto_id !== producto_id
                        )
                        : state.items.map((item) =>
                            item.producto_id === producto_id
                                ? { ...item, cantidad }
                                : item
                        )
                }))
            },

            vaciar: () => {
                set({ items: [] })
            },

            total: () => {
                return get().items.reduce(
                    (acumulado, item) => acumulado + item.precio_unitario * item.cantidad, 0
                )
            }
        }),
        {
            name: "foodstore-cart",

            partialize: (state) => ({
                items: state.items
            })
        }
    )
)
