import axios from "axios"


export function handleApiError(error: unknown): string {
    if (axios.isAxiosError<{ detail?: unknown }>(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
            return detail
        }

        if (Array.isArray(detail)) {
            const messages = detail
                .filter(
                    (item): item is { msg: string } =>
                        typeof item === "object" &&
                        item !== null &&
                        "msg" in item &&
                        typeof item.msg === "string"
                )
                .map((item) => item.msg)

            if (messages.length > 0) {
                return messages.join(". ")
            }
        }

        if (!error.response) {
            return "No se pudo conectar con el servidor."
        }
    }

    return "Ocurrió un error inesperado."
}
