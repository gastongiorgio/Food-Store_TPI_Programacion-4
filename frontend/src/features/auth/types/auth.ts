export type UserRole = "user" | "admin"

export interface User {
    id: number
    username: string
    full_name: string
    email: string
    role: UserRole
    disabled: boolean
    created_at: string
}

export interface RegisterData {
    username: string
    full_name: string
    email: string
    password: string
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface AuthMessage {
    message: string
}
