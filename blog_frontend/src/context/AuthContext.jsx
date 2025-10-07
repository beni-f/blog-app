"use client"

import { createContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import axiosInstance from "@/lib/axios"
import { LogOut } from "lucide-react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(null)

    const refreshToken = async () => {
        const refresh = localStorage.getItem('refreshToken')
        if (!refresh) {
            logout()
            return
        }

        try {
            const response = await axiosInstance.post('/login/refresh/', { refresh })
            const newAccess = response.data.access

            localStorage.setItem('token', newAccess)
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`
            setToken(newAccess)
        } catch (error) {
            console.error("Token refresh failed:", error)
            logout()
        }
    }

    const initializeAuth = async () => {
        const storedToken = localStorage.getItem('token')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        if (!storedToken && !storedRefreshToken) {
            logout()
            setLoading(false)
            return
        }

        try {
            if (storedToken) {
                const decoded = jwtDecode(storedToken)
                const isExpired = decoded.exp * 1000 < Date.now()

                if (isExpired && storedRefreshToken) {
                    await refreshToken()
                } else if (!isExpired) {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
                    setToken(storedToken)
                } else {
                    logout()
                }
            } else {
                await refreshToken()
            }
        } catch (error) {
            console.error("Initialization error:", error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            initializeAuth()
        }
    }, [])

    useEffect(() => {
        if (!token) return

        const decoded = jwtDecode(token)
        const expiresIn = decoded.exp * 1000 - Date.now()
        const refreshBefore = expiresIn - 60000

        if (refreshBefore <= 0) {
            refreshToken()
            return
        }

        const timeout = setTimeout(() => {
            refreshToken()
        }, refreshBefore)

        return () => clearTimeout(timeout)
    }, [token])

    const login = async (identifier, password) => {
        try {
            const response = await axiosInstance.post('/login/', { identifier, password })

            const access = response.data.access
            const refresh = response.data.refresh
            const user = response.data.user

            localStorage.setItem('token', access)
            localStorage.setItem('refreshToken', refresh)
            localStorage.setItem('user', JSON.stringify(user))
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`
            setToken(access)
            setUser(user)
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        delete axiosInstance.defaults.headers.common['Authorization']
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}