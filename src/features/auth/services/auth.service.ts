import { api } from "@/shared/lib/api/axios"
import type {
  AuthTokens,
  RegisterPayload,
  RegisterResponse,
} from "../types/auth.types"

export const authService = {
  login: (data: { username: string; password: string }) =>
    api.post<AuthTokens>("/users/token/", data),

  register: (data: RegisterPayload) =>
    api.post<RegisterResponse>("/users/register/", data),

  refresh: (refresh: string) =>
    api.post<Pick<AuthTokens, "access">>("/token/refresh/", { refresh }),

  verify: (token: string) =>
    api.post("/token/verify/", { token }),
}
