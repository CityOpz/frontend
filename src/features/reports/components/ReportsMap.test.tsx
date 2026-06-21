import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { mapReportsMock } from "../data/map-reports.mock"
import { ReportsMap } from "./ReportsMap"

vi.mock("leaflet", () => ({
  default: {
    icon: vi.fn(() => ({})),
  },
}))

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { readonly children: ReactNode }) => (
    <div data-testid="reports-map">{children}</div>
  ),
  Marker: ({
    children,
    title,
  }: {
    readonly children: ReactNode
    readonly title: string
  }) => (
    <div data-testid="report-marker" data-title={title}>
      {children}
    </div>
  ),
  Popup: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  TileLayer: () => <div data-testid="map-tiles" />,
}))

describe("ReportsMap", () => {
  it("renderiza el mapa con tres marcadores de reportes mock", () => {
    render(<ReportsMap reports={mapReportsMock} />)

    expect(screen.getByTestId("reports-map")).toBeInTheDocument()
    expect(screen.getByTestId("map-tiles")).toBeInTheDocument()
    expect(screen.getAllByTestId("report-marker")).toHaveLength(3)
    expect(screen.getByText("REP-001")).toBeInTheDocument()
    expect(screen.getByText("REP-002")).toBeInTheDocument()
    expect(screen.getByText("REP-003")).toBeInTheDocument()
  })
})
