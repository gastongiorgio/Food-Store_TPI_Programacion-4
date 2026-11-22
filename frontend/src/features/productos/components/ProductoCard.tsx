import { useState } from "react"

import type { Producto } from "../types/productos"


interface ProductoCardProps {
    producto: Producto
}


const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
})


const photoCredits = {
    muzzarella: {
        source: "https://commons.wikimedia.org/wiki/File:Pizza_de_muzzarella_al_estilo_argentino_servida_sobre_tabla_de_madera.jpg",
        license: "https://creativecommons.org/licenses/by-sa/3.0/",
        label: "CC BY-SA 3.0"
    },
    especial: {
        source: "https://commons.wikimedia.org/wiki/File:Pizza_mozzarella_con_huevos,_tomates,_jam%C3%B3n,_morr%C3%B3n_verde,_cebollas_y_especias.jpg",
        license: "https://creativecommons.org/licenses/by/4.0/",
        label: "CC BY 4.0"
    }
}


function ProductoCard({ producto }: ProductoCardProps) {
    const [failedImage, setFailedImage] = useState<string | null>(null)

    const disponible = producto.disponible && producto.stock > 0

    const imageUrl = producto.imagen_url?.trim()
    const showImage = Boolean(imageUrl && failedImage !== imageUrl)

    const isCommonsImage = imageUrl?.includes("commons.wikimedia.org")

    const credit = imageUrl?.includes(
        "Pizza_de_muzzarella_al_estilo_argentino"
    )
        ? photoCredits.muzzarella
        : imageUrl?.includes("Pizza_mozzarella_con_huevos")
            ? photoCredits.especial
            : null


    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

            {/* IMAGEN DEL PRODUCTO */}

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
                        className={
                            isCommonsImage
                                ? "block h-full w-full object-contain"
                                : "block h-full w-full object-cover"
                        }
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-6xl" aria-hidden="true">
                            🍽️
                        </span>
                    </div>
                )}

            </div>


            {/* INFORMACIÓN DEL PRODUCTO */}

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


                {/* CRÉDITOS DE FOTOGRAFÍAS CON LICENCIA CC */}

                {credit && showImage && (
                    <p className="text-[11px] leading-relaxed text-slate-400">
                        Foto:{" "}
                        <a
                            href={credit.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-teal-700"
                        >
                            Horacio Cambeiro
                        </a>
                        {" · "}
                        <a
                            href={credit.license}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-teal-700"
                        >
                            {credit.label}
                        </a>
                    </p>
                )}

            </div>

        </article>
    )
}


export default ProductoCard
