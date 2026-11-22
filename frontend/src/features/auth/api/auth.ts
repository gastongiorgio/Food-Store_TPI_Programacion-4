import { axiosInstance } from "../../../shared/api/axiosInstance"

import type {
    User,
    RegisterData,
    LoginCredentials,
    AuthMessage,
} from "../types/auth"


export async function register(
    data: RegisterData
): Promise<User> {
    const response = await axiosInstance.post<User>(
        "/auth/register",
        data
    )

    return response.data
}


export async function login(
    credentials: LoginCredentials
): Promise<AuthMessage> {
    const formData = new URLSearchParams()

    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    const response = await axiosInstance.post<AuthMessage>(
        "/auth/token",
        formData,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    )

    return response.data
}


export async function getSession(): Promise<User> {
    const response = await axiosInstance.get<User>("/auth/me")

    return response.data
}


export async function logout(): Promise<AuthMessage> {
    const response = await axiosInstance.post<AuthMessage>(
        "/auth/logout"
    )

    return response.data
}
