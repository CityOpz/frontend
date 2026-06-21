import { describe, expect, it } from "vitest"
import { canTransitionReportStatus } from "./report-status"

describe("canTransitionReportStatus", () => {
  it("permite avanzar al siguiente estado", () => {
    expect(canTransitionReportStatus("Pendiente", "En revisión")).toBe(true)
    expect(canTransitionReportStatus("En revisión", "Resuelto")).toBe(true)
  })

  it("impide saltar de Pendiente a Resuelto", () => {
    expect(canTransitionReportStatus("Pendiente", "Resuelto")).toBe(false)
  })

  it("impide retroceder estados", () => {
    expect(canTransitionReportStatus("Resuelto", "En revisión")).toBe(false)
    expect(canTransitionReportStatus("En revisión", "Pendiente")).toBe(false)
  })
})
