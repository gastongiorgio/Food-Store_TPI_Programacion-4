import { useState } from "react"

import { useCartStore } from "../../../store/cartStore"
import type { Producto } from "../types/productos"


interface ProductoCardProps {
    producto: Producto
}


const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})


function ProductoCard({ producto }: ProductoCardProps) {
    const [failedImage, setFailedImage] = useState<string | null>(null)

    const agregar = useCartStore((state) => state.agregar)

    const cantidadEnCarrito = useCartStore(
        (state) =>
            state.items.find(
                (item) => item.producto_id === producto.id
            )?.cantidad ?? 0
    )

    const disponible =
        producto.activo &&
        producto.disponible &&
        producto.stock > 0

    const puedeAgregar =
        disponible &&
        cantidadEnCarrito < producto.stock

    const imageUrl = producto.imagen_url?.trim()
    const showImage = Boolean(imageUrl && failedImage !== imageUrl)


    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

            <div className="aspect-square w-full shrink-0 overflow-hidden bg-[#F0EAE2]">

                {showImage ? (
                    <img
                        src={imageUrl}
                        alt={producto.nombre}
                        loading="lazy"
                        decoding="async"
                        onError={() => {
                            setFailedImage(imageUrl ?? null)
                        }}
                        className="block h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-6xl" aria-hidden="true">
                            🍽️
                        </span>
                    </div>
                )}

            </div>

            <div className="flex min-h-64 flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                        {producto.categoria.nombre}
                    </span>

                    <span
                        className={
                            disponible
                                ? "text-xs font-medium text-emerald-700"
                                : "text-xs font-medium text-red-600"
                        }
                    >
                        {disponible ? "Disponible" : "No disponible"}
                    </span>

                </div>

                <h2 className="text-lg font-semibold text-slate-800">
                    {producto.nombre}
                </h2>

                <p className="line-clamp-2 flex-1 text-sm text-slate-500">
                    {producto.descripcion || "Sin descripción"}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

                    <span className="text-xl font-bold text-slate-800">
                        {priceFormatter.format(producto.precio_base)}
                    </span>

                    <span className="text-xs text-slate-500">
                        Stock: {producto.stock}
                    </span>

                </div>

                <button
                    type="button"
                    disabled={!puedeAgregar}
                    onClick={() => agregar(producto)}
                    className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                    {!disponible
                        ? "No disponible"
                        : cantidadEnCarrito >= producto.stock
                            ? "Stock máximo alcanzado"
                            : "Agregar al carrito"}
                </button>

                {cantidadEnCarrito > 0 && (
                    <p className="text-center text-xs font-medium text-teal-700">
                        En el carrito: {cantidadEnCarrito}
                    </p>
                )}

            </div>

        </article>
    )
}


export default ProductoCard