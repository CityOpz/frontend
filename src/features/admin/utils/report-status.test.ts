import { describe, expect, it } from "vitest"
import {
  API_TO_REPORT_STATUS,
  canTransitionReportStatus,
  REPORT_STATUS_TO_API,
} from "./report-status"

describe("canTransitionReportStatus", () => {
  it("permite avanzar al siguiente estado", () => {
    expect(canTransitionReportStatus("Pendiente", "En revisión")).toBe(true)
    expect(canTransitionReportStatus("En revisión", "En reparación")).toBe(true)
    expect(canTransitionReportStatus("En reparación", "Resuelto")).toBe(true)
  })

  it("impide saltar estados", () => {
    expect(canTransitionReportStatus("Pendiente", "En reparación")).toBe(false)
    expect(canTransitionReportStatus("Pendiente", "Resuelto")).toBe(false)
  })

  it("impide retroceder estados", () => {
    expect(canTransitionReportStatus("Resuelto", "En reparación")).toBe(false)
    expect(canTransitionReportStatus("En revisión", "Pendiente")).toBe(false)
  })
})

describe("report status API mapping", () => {
  it("traduce estados entre backend y UI", () => {
    expect(API_TO_REPORT_STATUS.IN_REVIEW).toBe("En revisión")
    expect(REPORT_STATUS_TO_API["En reparación"]).toBe("IN_REPAIR")
  })
})
