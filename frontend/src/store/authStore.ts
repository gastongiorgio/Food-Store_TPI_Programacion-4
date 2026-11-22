import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
    login as loginRequest,
    getSession,
    logout as logoutRequest
} from "../features/auth/api/auth"

import type {
    User,
    LoginCredentials
} from "../features/auth/types/auth"

import { queryClient } from "../shared/api/queryClient"


interface AuthState {
    usuario: User | null
    cargando: boolean

    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => Promise<void>
    checkSession: () => Promise<void>
}


export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            usuario: null,
            cargando: true,

            login: async (credentials) => {
                set({ cargando: true })

                try {
                    await loginRequest(credentials)

                    const usuario = await getSession()

                    queryClient.clear()
                    set({ usuario })
                } finally {
                    set({ cargando: false })
                }
            },

            logout: async () => {
                set({ cargando: true })

                try {
                    await logoutRequest()

                    queryClient.clear()
                    set({ usuario: null })
                } finally {
                    set({ cargando: false })
                }
            },

            checkSession: async () => {
                set({ cargando: true })

                try {
                    const usuario = await getSession()

                    set({ usuario })
                } catch {
                    queryClient.clear()
                    set({ usuario: null })
                } finally {
                    set({ cargando: false })
                }
            }
        }),
        {
            name: "foodstore-auth",
            partialize: (state) => ({
                usuario: state.usuario
            })
        }
    )
)
