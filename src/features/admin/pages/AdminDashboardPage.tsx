import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  Settings,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import useDocumentTitle from "@/shared/hooks/useDocumentTitle"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import ThemeToggle from "@/shared/theme/components/ThemeToggle"
import { ReportsTable } from "../components/ReportsTable"
import { adminReportsService } from "../services/admin-reports.service"
import type { Report, ReportStatus } from "../types/report.types"
import { canTransitionReportStatus } from "../utils/report-status"
import { Sidebar } from "@/shared/components/Sidebar"

const navItems = [
  { label: "Resumen", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Reportes", icon: ClipboardList, active: true, path: "/dashboard" },
  { label: "Mapa", icon: Map, path: "/map" },
  { label: "Usuarios", icon: Users },
  { label: "Configuración", icon: Settings },
]

export default function AdminDashboardPage() {
  useDocumentTitle("Dashboard administrativo")

  const [reports, setReports] = useState<Report[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [reportsError, setReportsError] = useState<string | null>(null)
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadReports() {
      setIsLoadingReports(true)
      setReportsError(null)

      try {
        const apiReports = await adminReportsService.getReports()

        if (isMounted) {
          setReports(apiReports)
        }
      } catch {
        if (isMounted) {
          setReportsError("No se pudieron cargar los reportes.")
        }
      } finally {
        if (isMounted) {
          setIsLoadingReports(false)
        }
      }
    }

    void loadReports()

    return () => {
      isMounted = false
    }
  }, [])

  const pendingReports = reports.filter(
    (report) => report.status === "Pendiente",
  ).length

  const handleStatusChange = async (reportId: string, nextStatus: ReportStatus) => {
    const previousReports = reports
    const currentReport = reports.find((report) => report.id === reportId)

    if (
      !currentReport ||
      !canTransitionReportStatus(currentReport.status, nextStatus)
    ) {
      return
    }

    setReportsError(null)
    setUpdatingReportId(reportId)
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, status: nextStatus } : report,
      ),
    )

    try {
      const updatedReport = await adminReportsService.updateStatus(
        reportId,
        nextStatus,
      )

      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId ? updatedReport : report,
        ),
      )
    } catch {
      setReports(previousReports)
      setReportsError("No se pudo actualizar el estado del reporte.")
    } finally {
      setUpdatingReportId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        panelName="Panel administrativo"
        menuTitle="Gestión"
        navItems={navItems}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-20 items-center border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-8">
          <Button
            aria-label="Abrir menú"
            className="mr-3 lg:hidden"
            size="icon"
            variant="ghost"
          >
            <Menu />
          </Button>
          <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-muted-foreground md:flex">
            <Search aria-hidden="true" className="size-4" />
            <span className="text-sm">Buscar en el panel...</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button aria-label="Notificaciones" size="icon" variant="outline">
              <Bell />
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge className="mb-3 border-primary/20 bg-primary/10 text-primary">
                Gestión ciudadana
              </Badge>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Reportes ciudadanos
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Consulta y administra las incidencias reportadas por la comunidad.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
              <span className="text-muted-foreground">Pendientes por revisar</span>
              <strong className="ml-3 text-xl text-foreground">{pendingReports}</strong>
            </div>
          </section>

          <Card padding="none" className="overflow-hidden bg-card">
            <CardHeader className="flex-row items-center justify-between border-b border-border p-5 sm:p-6">
              <div>
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Todos los reportes
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isLoadingReports
                    ? "Cargando reportes..."
                    : `${reports.length} reportes registrados`}
                </p>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground">
                API backend
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              {reportsError && (
                <div
                  className="border-b border-destructive/20 bg-destructive/10 px-5 py-3 text-sm font-medium text-destructive"
                  role="alert"
                >
                  {reportsError}
                </div>
              )}

              {isLoadingReports ? (
                <div className="p-6 text-sm text-muted-foreground">
                  Cargando reportes...
                </div>
              ) : (
                <ReportsTable
                  reports={reports}
                  updatingReportId={updatingReportId}
                  onStatusChange={handleStatusChange}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}