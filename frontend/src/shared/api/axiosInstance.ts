import axios from "axios"


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})


let onInvalidSession: (() => void) | null = null


export function setInvalidSessionHandler(
    handler: () => void
): void {
    onInvalidSession = handler
}


axiosInstance.interceptors.response.use(
    (response) => response,

    (error: unknown) => {
        if (axios.isAxiosError<{ detail?: unknown }>(error)) {
            const status = error.response?.status
            const detail = error.response?.data?.detail
            const url = error.config?.url ?? ""

            const isAuthRequest =
                url.includes("/auth/token") ||
                url.includes("/auth/me")

            const unauthorized =
                status === 401 && !isAuthRequest

            const disabled =
                status === 400 &&
                detail === "Cuenta de usuario desactivada"

            if (unauthorized || disabled) {
                onInvalidSession?.()
            }
        }

        return Promise.reject(error)
    }
)
