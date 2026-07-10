import type { ReactNode } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Sidebar } from "./Sidebar"
import { useAuthStore } from "@/features/auth/store/auth.store"
import type { UserInfo } from "@/features/auth/types/auth.types"

type AuthStoreSelector = Parameters<typeof useAuthStore>[0]

interface LinkProps {
  children: ReactNode
  to: string
  className?: string
  [key: string]: unknown
}

vi.mock("@/features/auth/store/auth.store")

const mockNavigate = vi.fn()
vi.mock("react-router", () => ({
  Link: ({ children, to, className, "aria-current": ariaCurrent, ...props }: LinkProps) => (
    <a
      href={to}
      className={className}
      aria-current={ariaCurrent as "page" | "step" | "location" | "date" | "time" | "true" | "false" | undefined}
      {...props}
    >
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}))

const MockIcon1 = ({ className }: { className?: string }) => (
  <svg data-testid="icon-1" className={className} />
)
const MockIcon2 = ({ className }: { className?: string }) => (
  <svg data-testid="icon-2" className={className} />
)
const MockIcon3 = ({ className }: { className?: string }) => (
  <svg data-testid="icon-3" className={className} />
)

const mockNavItems = [
  { label: "Resumen", icon: MockIcon1, path: "/dashboard" },
  { label: "Reportes", icon: MockIcon2, active: true, path: "/reports" },
  { label: "Usuarios", icon: MockIcon3 },
]

const getMockStore = (user: UserInfo | null) => ({
  user,
  access: user ? "access-token" : null,
  refresh: user ? "refresh-token" : null,
  isAuthenticated: !!user,
  initialized: true,
  setTokens: vi.fn(),
  setAccess: vi.fn(),
  logout: vi.fn(),
})

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockImplementation((selector: AuthStoreSelector) =>
      selector(
        getMockStore({
          id: 1,
          role: "ADMIN" as const,
          first_name: "Juan",
          last_name: "Toro",
          email: "juan@example.com",
        })
      )
    )
  })

  describe("renderizado básico", () => {
    it("renderiza el logo y nombre de la aplicación", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByText("CityOpz")).toBeInTheDocument()
      expect(screen.getByText("Panel Admin")).toBeInTheDocument()
    })

    it("renderiza el título del menú", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByText("Gestión")).toBeInTheDocument()
    })
  })

  describe("items de navegación", () => {
    it("renderiza todos los items de navegación", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByText("Resumen")).toBeInTheDocument()
      expect(screen.getByText("Reportes")).toBeInTheDocument()
      expect(screen.getByText("Usuarios")).toBeInTheDocument()
    })

    it("renderiza items con path como enlaces", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const resumenLink = screen.getByText("Resumen").closest("a")
      const reportesLink = screen.getByText("Reportes").closest("a")
      expect(resumenLink).toHaveAttribute("href", "/dashboard")
      expect(reportesLink).toHaveAttribute("href", "/reports")
    })

    it("renderiza items sin path como botones", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const usuariosButton = screen.getByText("Usuarios").closest("button")
      expect(usuariosButton).toBeInTheDocument()
    })

    it("aplica aria-current=page al item activo", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const reportesLink = screen.getByText("Reportes").closest("a")
      expect(reportesLink).toHaveAttribute("aria-current", "page")
    })

    it("no aplica aria-current a items no activos", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const resumenLink = screen.getByText("Resumen").closest("a")
      expect(resumenLink).not.toHaveAttribute("aria-current")
    })
  })

  describe("información del usuario", () => {
    it("muestra el nombre completo del usuario autenticado", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByText("Juan Toro")).toBeInTheDocument()
    })

    it("muestra el rol del usuario como Administrador", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByText("Administrador")).toBeInTheDocument()
    })

    it("muestra el rol del usuario como Ciudadano", () => {
      vi.mocked(useAuthStore).mockImplementation((selector: AuthStoreSelector) =>
        selector(
          getMockStore({
            id: 2,
            role: "CITIZEN" as const,
            first_name: "María",
            last_name: "García",
            email: "maria@example.com",
          })
        )
      )
      render(<Sidebar panelName="Panel Ciudadano" menuTitle="Menú" navItems={mockNavItems} />)
      expect(screen.getByText("Ciudadano")).toBeInTheDocument()
    })

    it("muestra las iniciales del usuario cuando no hay foto", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByText("JT")).toBeInTheDocument()
    })

    it("muestra valores por defecto cuando no hay usuario autenticado", () => {
      vi.mocked(useAuthStore).mockImplementation((selector: AuthStoreSelector) =>
        selector(getMockStore(null))
      )
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByText("Juan Toro")).toBeInTheDocument()
      expect(screen.getByText("JT")).toBeInTheDocument()
    })
  })

  describe("menú de perfil", () => {
    it("abre el menú de perfil al hacer click en el botón", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)
      expect(screen.getByText("Subir foto")).toBeInTheDocument()
      expect(screen.getByText("Cerrar sesión")).toBeInTheDocument()
    })

    it("cierra el menú de perfil al hacer click nuevamente", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)
      expect(screen.getByText("Subir foto")).toBeInTheDocument()
      fireEvent.click(profileButton)
      expect(screen.queryByText("Subir foto")).not.toBeInTheDocument()
    })

    it("muestra el link de cerrar sesión con href correcto", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)
      const logoutLink = screen.getByText("Cerrar sesión").closest("a")
      expect(logoutLink).toHaveAttribute("href", "/logout")
    })
  })

  describe("foto de perfil", () => {
    it("permite subir una foto de perfil", async () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)
      const fileInput = screen.getByLabelText("Abrir opciones de foto de perfil").parentElement?.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" })
      fireEvent.change(fileInput, { target: { files: [file] } })
      await waitFor(() => {
        expect(screen.getByAltText("Foto de perfil de Juan Toro")).toBeInTheDocument()
      })
    })

    it("muestra 'Subir foto' cuando no hay foto de perfil", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)
      expect(screen.getByText("Subir foto")).toBeInTheDocument()
    })

    it("muestra 'Cambiar foto' cuando ya hay una foto de perfil", async () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)

      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)

      const fileInput = screen.getByLabelText("Abrir opciones de foto de perfil").parentElement?.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" })
      fireEvent.change(fileInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByAltText("Foto de perfil de Juan Toro")).toBeInTheDocument()
      })

      fireEvent.click(profileButton)
      expect(screen.getByText("Cambiar foto")).toBeInTheDocument()
    })

    it("permite quitar la foto de perfil", async () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)

      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)

      const fileInput = screen.getByLabelText("Abrir opciones de foto de perfil").parentElement?.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" })
      fireEvent.change(fileInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByAltText("Foto de perfil de Juan Toro")).toBeInTheDocument()
      })

      fireEvent.click(profileButton)
      expect(screen.getByText("Quitar foto")).toBeInTheDocument()

      fireEvent.click(screen.getByText("Quitar foto"))

      await waitFor(() => {
        expect(screen.queryByAltText("Foto de perfil de Juan Toro")).not.toBeInTheDocument()
      })

      fireEvent.click(profileButton)
      expect(screen.getByText("Subir foto")).toBeInTheDocument()
    })

    it("no procesa el archivo si no se selecciona ninguno", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      fireEvent.click(profileButton)
      const fileInput = screen.getByLabelText("Abrir opciones de foto de perfil").parentElement?.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      fireEvent.change(fileInput, { target: { files: [] } })
      expect(screen.queryByAltText("Foto de perfil de Juan Toro")).not.toBeInTheDocument()
    })
  })

  describe("accesibilidad", () => {
    it("tiene aria-label en el botón de perfil", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByLabelText("Abrir opciones de foto de perfil")).toBeInTheDocument()
    })

    it("tiene aria-expanded en el botón de perfil", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
      expect(profileButton).toHaveAttribute("aria-expanded", "false")
      fireEvent.click(profileButton)
      expect(profileButton).toHaveAttribute("aria-expanded", "true")
    })

    it("tiene aria-label en la navegación", () => {
      render(<Sidebar panelName="Panel Admin" menuTitle="Gestión" navItems={mockNavItems} />)
      expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument()
    })
  })
})