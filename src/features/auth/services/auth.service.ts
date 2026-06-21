import { api } from "@/shared/lib/api/axios"

export const authService = {
  login: (data: { username: string; password: string }) =>
    api.post("/token/", data),

  register: (data: {
    username: string
    email: string
    first_name: string
    last_name: string
    password: string
  }) => api.post("/users/register/", data),

  refresh: (refresh: string) =>
    api.post("/token/refresh/", { refresh }),

  verify: (token: string) =>
    api.post("/token/verify/", { token }),
}
