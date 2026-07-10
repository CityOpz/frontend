import {
  Bell,
  ClipboardList,
  Map,
  MapPin,
  Menu,
  Plus,
  Search,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import useDocumentTitle from "@/shared/hooks/useDocumentTitle"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import ThemeToggle from "@/shared/theme/components/ThemeToggle"
import { reportsService } from "../services/reports.service"
import type { ApiReport } from "../types/report-api.types"
import { Sidebar } from "@/shared/components/Sidebar"

const navItems = [
  { label: "Mis Reportes", icon: ClipboardList, active: true, path: "/dashboard" },
  { label: "Nuevo Reporte", icon: Plus, path: "/reports/new" },
  { label: "Mapa de Reportes", icon: Map, path: "/map" },
]

const API_STATUS_TO_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  IN_REVIEW: "En revisión",
  IN_REPAIR: "En reparación",
  RESOLVED: "Resuelto",
}

const statusStyles: Record<string, string> = {
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  IN_REVIEW: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  IN_REPAIR: "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  RESOLVED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
}

const coordinateFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

export default function CitizenDashboardPage() {
  useDocumentTitle("Mi Panel Ciudadano")

  const [reports, setReports] = useState<ApiReport[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [reportsError, setReportsError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadReports() {
      setIsLoadingReports(true)
      setReportsError(null)

      try {
        const apiReports = await reportsService.listCitizenReports()

        if (isMounted) {
          setReports(apiReports)
        }
      } catch {
        if (isMounted) {
          setReportsError("No se pudieron cargar tus reportes.")
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

  const totalReports = reports.length
  const pendingReports = reports.filter((r) => r.status === "PENDING").length
  const inProgressReports = reports.filter((r) => r.status === "IN_REVIEW" || r.status === "IN_REPAIR").length
  const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        panelName="Panel Ciudadano"
        menuTitle="Menú"
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
            <span className="text-sm">Buscar en tus reportes...</span>
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
                Mis Incidencias
              </Badge>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Mis Reportes Creados
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Monitorea el progreso de los reportes que has enviado a la municipalidad.
              </p>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
              to="/reports/new"
            >
              <Plus className="size-4" />
              Nuevo reporte
            </Link>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <span className="text-sm font-semibold text-muted-foreground">Total reportes</span>
                <strong className="block text-3xl font-black mt-2 text-foreground">{totalReports}</strong>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <span className="text-sm font-semibold text-muted-foreground">Pendientes</span>
                <strong className="block text-3xl font-black mt-2 text-amber-500">{pendingReports}</strong>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <span className="text-sm font-semibold text-muted-foreground">En revisión / reparación</span>
                <strong className="block text-3xl font-black mt-2 text-blue-500">{inProgressReports}</strong>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <span className="text-sm font-semibold text-muted-foreground">Resueltos</span>
                <strong className="block text-3xl font-black mt-2 text-emerald-500">{resolvedReports}</strong>
              </CardContent>
            </Card>
          </section>

          <Card padding="none" className="overflow-hidden bg-card">
            <CardHeader className="flex-row items-center justify-between border-b border-border p-5 sm:p-6">
              <div>
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Listado de mis reportes
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isLoadingReports
                    ? "Cargando reportes..."
                    : `${reports.length} reportes registrados por ti`}
                </p>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground">
                Ciudadano
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
                  Cargando tus reportes...
                </div>
              ) : reports.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Aún no has creado ningún reporte. ¡Haz clic en "Nuevo reporte" para empezar!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table aria-label="Listado de reportes creados por el ciudadano">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Ubicación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => {
                        const formattedId = `REP-${String(report.id).padStart(3, "0")}`
                        const categoryLabel = report.category?.name ?? "Sin categoría"
                        return (
                          <TableRow key={report.id}>
                            <TableCell className="font-semibold">
                              <Link to={`/reports/${report.id}`} className="text-primary hover:underline hover:text-primary/80">
                                {formattedId}
                              </Link>
                            </TableCell>
                            <TableCell className="min-w-64 whitespace-normal font-medium text-foreground">
                              <div className="space-y-1">
                                <Link to={`/reports/${report.id}`} className="hover:underline hover:text-primary block font-semibold">
                                  {report.title}
                                </Link>
                                <p className="text-xs text-muted-foreground font-normal line-clamp-2">
                                  {report.detail}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {categoryLabel}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusStyles[report.status] || ""}>
                                {API_STATUS_TO_LABEL[report.status] || report.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                              {report.created_at
                                ? new Date(report.created_at).toLocaleDateString("es-CO", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Sin fecha"}
                            </TableCell>
                            <TableCell>
                              {report.latitude !== undefined && report.longitude !== undefined ? (
                                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                  <MapPin aria-hidden="true" className="size-3.5 text-primary shrink-0" />
                                  {coordinateFormatter.format(report.latitude)},{" "}
                                  {coordinateFormatter.format(report.longitude)}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">Sin ubicación</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
