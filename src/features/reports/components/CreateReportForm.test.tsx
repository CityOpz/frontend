import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CreateReportForm } from "./CreateReportForm"

describe("CreateReportForm", () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, "geolocation", {
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

  it("permite enviar cuando los campos obligatorios están completos", () => {
    render(<CreateReportForm />)

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Semáforo fuera de servicio" },
    })
    fireEvent.change(screen.getByLabelText("Descripción"), {
      target: { value: "El semáforo no funciona desde esta mañana." },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear reporte" }))

    expect(screen.getByRole("status")).toHaveTextContent(
      "Reporte creado correctamente",
    )
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

    Object.defineProperty(window.navigator, "geolocation", {
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
})
