import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { reportsService } from "../services/reports.service"
import { CreateReportForm } from "./CreateReportForm"

vi.mock("../services/reports.service", async () => {
  const actual = await vi.importActual<typeof import("../services/reports.service")>(
    "../services/reports.service",
  )

  return {
    ...actual,
    reportsService: {
      create: vi.fn(),
    },
  }
})

describe("CreateReportForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(reportsService.create).mockResolvedValue({
      data: {
        id: 1,
        title: "Reporte creado",
        detail: "Detalle",
        status: "PENDING",
      },
    } as Awaited<ReturnType<typeof reportsService.create>>)

    Object.defineProperty(globalThis.navigator, "geolocation", {
      configurable: true,
      value: undefined,
    })
  })

  it("no permite enviar el formulario sin título ni descripción", () => {
    render(<CreateReportForm />)

    fireEvent.click(screen.getByRole("button", { name: "Crear reporte" }))

    expect(screen.getByText("El título es obligatorio.")).toBeInTheDocument()
    expect(screen.getByText("La descripción es obligatoria.")).toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("permite enviar cuando los campos obligatorios están completos", async () => {
    render(<CreateReportForm />)

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Semáforo fuera de servicio" },
    })
    fireEvent.change(screen.getByLabelText("Descripción"), {
      target: { value: "El semáforo no funciona desde esta mañana." },
    })
    fireEvent.change(screen.getByLabelText("Categoría"), {
      target: { value: "4" },
    })
    fireEvent.change(screen.getByLabelText("Latitud"), {
      target: { value: "4.653300" },
    })
    fireEvent.change(screen.getByLabelText("Longitud"), {
      target: { value: "-74.083700" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear reporte" }))

    await waitFor(() => {
      expect(reportsService.create).toHaveBeenCalledWith({
        title: "Semáforo fuera de servicio",
        detail: "El semáforo no funciona desde esta mañana.",
        categoryId: 4,
        latitude: 4.6533,
        longitude: -74.0837,
        photo: null,
      })
    })
    expect(screen.getByLabelText("Categoría")).toHaveValue("1")
    expect(screen.getByRole("status")).toHaveTextContent("Reporte creado correctamente")
  })

  it("guarda latitud y longitud en campos ocultos", async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({
        coords: {
          latitude: 4.711,
          longitude: -74.0721,
        },
      } as GeolocationPosition)
    })

    Object.defineProperty(globalThis.navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    })

    const { container } = render(<CreateReportForm />)

    fireEvent.click(
      screen.getByRole("button", { name: "Obtener mi ubicación" }),
    )

    await waitFor(() => {
      expect(container.querySelector<HTMLInputElement>('input[name="latitude"]')).toHaveValue(
        "4.711000",
      )
      expect(container.querySelector<HTMLInputElement>('input[name="longitude"]')).toHaveValue(
        "-74.072100",
      )
    })
    expect(getCurrentPosition).toHaveBeenCalledOnce()
  })

  it("permite ingresar la ubicación manualmente", () => {
    const { container } = render(<CreateReportForm />)

    fireEvent.change(screen.getByLabelText("Latitud"), {
      target: { value: "4.653300" },
    })
    fireEvent.change(screen.getByLabelText("Longitud"), {
      target: { value: "-74.083700" },
    })

    expect(container.querySelector<HTMLInputElement>('input[name="latitude"]')).toHaveValue(
      "4.653300",
    )
    expect(container.querySelector<HTMLInputElement>('input[name="longitude"]')).toHaveValue(
      "-74.083700",
    )
    expect(screen.getByText("Ubicación obtenida: 4.653300, -74.083700")).toBeInTheDocument()
  })

  it("muestra un error si el envío al backend falla", async () => {
    vi.mocked(reportsService.create).mockRejectedValue({
      response: { data: { detail: "Credenciales no provistas." } },
    })

    render(<CreateReportForm />)

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Andén roto" },
    })
    fireEvent.change(screen.getByLabelText("Descripción"), {
      target: { value: "Hay una losa levantada en la esquina." },
    })
    fireEvent.change(screen.getByLabelText("Latitud"), {
      target: { value: "4.653300" },
    })
    fireEvent.change(screen.getByLabelText("Longitud"), {
      target: { value: "-74.083700" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear reporte" }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Credenciales no provistas.")
    })
  })

  it("muestra un error si el navegador no ofrece geolocalización", () => {
    render(<CreateReportForm />)

    fireEvent.click(
      screen.getByRole("button", { name: "Obtener mi ubicación" }),
    )

    expect(screen.getByRole("alert")).toHaveTextContent(
      "La geolocalización no está disponible",
    )
  })

  it("muestra un error si no puede obtener la ubicación", async () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error({ code: 1, message: "Permission denied", PERMISSION_DENIED: 1 } as GeolocationPositionError)
      },
    )

    Object.defineProperty(globalThis.navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    })

    render(<CreateReportForm />)

    fireEvent.click(
      screen.getByRole("button", { name: "Obtener mi ubicación" }),
    )

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "No fue posible obtener tu ubicación",
      )
    })
  })
})
