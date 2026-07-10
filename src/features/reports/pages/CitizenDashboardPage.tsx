import {
  Bell,
  Camera,
  ChevronDown,
  ClipboardList,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { useEffect, useRef, useState, type ChangeEventHandler } from "react"
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
import { useAuthStore } from "@/features/auth/store/auth.store"
import { reportsService } from "../services/reports.service"
import type { ApiReport } from "../types/report-api.types"

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
  const user = useAuthStore((s) => s.user)
  const userFullName = user ? `${user.first_name} ${user.last_name}` : "Ciudadano"
  const userRole = "Ciudadano"
  const userInitials = user ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase() || "US" : "CI"

  const [reports, setReports] = useState<ApiReport[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [reportsError, setReportsError] = useState<string | null>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>()
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    return () => {
      if (profilePhotoUrl) {
        URL.revokeObjectURL(profilePhotoUrl)
      }
    }
  }, [profilePhotoUrl])

  const handleProfilePhotoChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setProfilePhotoUrl(URL.createObjectURL(file))
    setIsProfileMenuOpen(false)
    event.target.value = ""
  }

  const openProfilePhotoPicker = () => {
    profilePhotoInputRef.current?.click()
  }

  const removeProfilePhoto = () => {
    setProfilePhotoUrl(undefined)
    setIsProfileMenuOpen(false)

    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = ""
    }
  }

  const totalReports = reports.length
  const pendingReports = reports.filter((r) => r.status === "PENDING").length
  const inProgressReports = reports.filter((r) => r.status === "IN_REVIEW" || r.status === "IN_REPAIR").length
  const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">
            C
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">CityOpz</p>
            <p className="text-xs text-muted-foreground">Panel Ciudadano</p>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Menú
          </p>
          {navItems.map(({ label, icon: Icon, active, path }) => {
            const className = `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`

            return (
              <Link
                key={label}
                aria-current={active ? "page" : undefined}
                className={className}
                to={path}
              >
                <Icon aria-hidden="true" className="size-5" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="relative">
            <input
              ref={profilePhotoInputRef}
              accept="image/*"
              className="sr-only"
              onChange={handleProfilePhotoChange}
              type="file"
            />
            <button
              aria-expanded={isProfileMenuOpen}
              aria-label="Abrir opciones de foto de perfil"
              className="flex w-full items-center gap-3 rounded-xl bg-background/60 p-3 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              type="button"
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            >
              <span className="group relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {profilePhotoUrl ? (
                  <img
                    alt={`Foto de perfil de ${userFullName}`}
                    className="size-full object-cover"
                    src={profilePhotoUrl}
                  />
                ) : (
                  userInitials
                )}
                <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Camera className="size-4" />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{userFullName}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {userRole}
                </span>
              </span>
              <ChevronDown
                className={`ml-auto size-4 text-muted-foreground transition-transform ${
                  isProfileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl">
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                  type="button"
                  onClick={openProfilePhotoPicker}
                >
                  <ImagePlus className="size-4 text-primary" />
                  {profilePhotoUrl ? "Cambiar foto" : "Subir foto"}
                </button>
                {profilePhotoUrl && (
                  <button
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400"
                    type="button"
                    onClick={removeProfilePhoto}
                  >
                    <Trash2 className="size-4" />
                    Quitar foto
                  </button>
                )}
                <Link
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400"
                  to="/logout"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

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
