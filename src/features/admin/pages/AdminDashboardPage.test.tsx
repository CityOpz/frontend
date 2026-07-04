import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import AdminDashboardPage from "./AdminDashboardPage"

describe("AdminDashboardPage", () => {
  beforeEach(() => {
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:profile-photo"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
  })

  it("permite subir y quitar una foto de perfil desde el menú lateral", () => {
    const { container } = render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    )
    const profilePhotoInput = container.querySelector<HTMLInputElement>(
      'input[type="file"][accept="image/*"]',
    )
    const profilePhoto = new File(["profile"], "profile.png", {
      type: "image/png",
    })

    expect(profilePhotoInput).not.toBeNull()

    fireEvent.click(
      screen.getByRole("button", { name: "Abrir opciones de foto de perfil" }),
    )
    expect(screen.getByRole("button", { name: "Subir foto" })).toBeInTheDocument()

    fireEvent.change(profilePhotoInput!, { target: { files: [profilePhoto] } })

    expect(screen.getByAltText("Foto de perfil de Juan Toro")).toHaveAttribute(
      "src",
      "blob:profile-photo",
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Abrir opciones de foto de perfil" }),
    )
    fireEvent.click(screen.getByRole("button", { name: "Quitar foto" }))

    expect(screen.queryByAltText("Foto de perfil de Juan Toro")).not.toBeInTheDocument()
  })
})
