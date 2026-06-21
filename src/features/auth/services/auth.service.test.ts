// src/features/auth/services/auth.service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest"
import { authService } from "./auth.service"
import { api } from "@/shared/lib/api/axios"

vi.mock("@/shared/lib/api/axios", () => ({
  api: {
    post: vi.fn(),
  },
}))

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("login llama al endpoint correcto", async () => {
    const mockResponse = { data: { access: "token", refresh: "refresh" } }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    await authService.login({ username: "user", password: "pass" })

    expect(api.post).toHaveBeenCalledWith("/token/", {
      username: "user",
      password: "pass",
    })
  })

  it("register llama al endpoint correcto", async () => {
    const mockResponse = { data: { id: 1 } }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    await authService.register({
      username: "user",
      email: "user@test.com",
      first_name: "John",
      last_name: "Doe",
      password: "pass",
    })

    expect(api.post).toHaveBeenCalledWith("/users/register/", {
      username: "user",
      email: "user@test.com",
      first_name: "John",
      last_name: "Doe",
      password: "pass",
    })
  })

  it("refresh llama al endpoint correcto", async () => {
    const mockResponse = { data: { access: "new-token" } }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    await authService.refresh("refresh-token")

    expect(api.post).toHaveBeenCalledWith("/token/refresh/", {
      refresh: "refresh-token",
    })
  })

  it("verify llama al endpoint correcto", async () => {
    const mockResponse = { data: {} }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    await authService.verify("token")

    expect(api.post).toHaveBeenCalledWith("/token/verify/", {
      token: "token",
    })
  })
})
