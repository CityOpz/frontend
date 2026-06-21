import { api } from "./axios"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { authService } from "@/features/auth/services/auth.service"

let isRefreshing = false
let queue: ((token: string | null) => void)[] = []

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject(error)
    }

    if (originalRequest.url?.includes("/token/refresh/")) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }

    if (error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = useAuthStore.getState().refresh

    if (!refreshToken) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (!token) return reject(error)

          originalRequest.headers = originalRequest.headers ?? {}
          originalRequest.headers.Authorization = `Bearer ${token}`

          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      const response = await authService.refresh(refreshToken)
      const newAccess = response.data.access

      useAuthStore.getState().setAccess(newAccess)

      queue.forEach((cb) => cb(newAccess))
      queue = []

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${newAccess}`

      return api(originalRequest)
    } catch (err) {
      useAuthStore.getState().logout()
      
      queue.forEach((cb) => cb(null)) 
      queue = []
      
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)
