import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ReportsTable } from "./ReportsTable"
import type { Report } from "../types/report.types"

const pendingReport: Report = {
  id: "REP-TEST",
  title: "Reporte de prueba",
  category: "Infraestructura vial",
  status: "Pendiente",
  coordinates: { latitude: 4.711, longitude: -74.0721 },
}

describe("ReportsTable", () => {
  it("permite seleccionar únicamente el siguiente estado", () => {
    const onStatusChange = vi.fn()

    render(
      <ReportsTable
        reports={[pendingReport]}
        onStatusChange={onStatusChange}
      />,
    )

    const selector = screen.getByLabelText("Cambiar estado del reporte REP-TEST")
    const options = within(selector).getAllByRole("option")

    expect(options[1]).toBeEnabled()
    expect(options[2]).toBeDisabled()

    fireEvent.change(selector, { target: { value: "En revisión" } })

    expect(onStatusChange).toHaveBeenCalledWith("REP-TEST", "En revisión")
  })

  it("bloquea el selector cuando el reporte está resuelto", () => {
    render(
      <ReportsTable
        reports={[{ ...pendingReport, status: "Resuelto" }]}
        onStatusChange={vi.fn()}
      />,
    )

    expect(
      screen.getByLabelText("Cambiar estado del reporte REP-TEST"),
    ).toBeDisabled()
  })
})
