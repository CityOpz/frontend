import {
  Bell,
  Camera,
  ChevronDown,
  ClipboardList,
  ImagePlus,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  Settings,
  Trash2,
  Users,
} from "lucide-react"
import { useEffect, useRef, useState, type ChangeEventHandler } from "react"
import { Link } from "react-router"
import useDocumentTitle from "@/shared/hooks/useDocumentTitle"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import ThemeToggle from "@/shared/theme/components/ThemeToggle"
import { mockReports } from "../data/reports.mock"
import { ReportsTable } from "../components/ReportsTable"
import type { ReportStatus } from "../types/report.types"
import { canTransitionReportStatus } from "../utils/report-status"

const navItems = [
  { label: "Resumen", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Reportes", icon: ClipboardList, active: true, path: "/dashboard" },
  { label: "Mapa", icon: Map, path: "/map" },
  { label: "Usuarios", icon: Users },
  { label: "Configuración", icon: Settings },
]

export default function AdminDashboardPage() {
  useDocumentTitle("Dashboard administrativo")
  const [reports, setReports] = useState(() => mockReports)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>()
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (profilePhotoUrl) {
        URL.revokeObjectURL(profilePhotoUrl)
      }
    }
  }, [profilePhotoUrl])

  const pendingReports = reports.filter(
    (report) => report.status === "Pendiente",
  ).length

  const handleStatusChange = (reportId: string, nextStatus: ReportStatus) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId &&
        canTransitionReportStatus(report.status, nextStatus)
          ? { ...report, status: nextStatus }
          : report,
      ),
    )
  }

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">
            C
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">CityOpz</p>
            <p className="text-xs text-muted-foreground">Panel administrativo</p>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Gestión
          </p>
          {navItems.map(({ label, icon: Icon, active, path }) => {
            const className = `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`

            return path ? (
              <Link
              key={label}
              aria-current={active ? "page" : undefined}
              className={className}
              to={path}
            >
              <Icon aria-hidden="true" className="size-5" />
              {label}
              </Link>
            ) : (
              <button key={label} className={className} type="button">
                <Icon aria-hidden="true" className="size-5" />
                {label}
              </button>
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
                    alt="Foto de perfil de Juan Toro"
                    className="size-full object-cover"
                    src={profilePhotoUrl}
                  />
                ) : (
                  "JT"
                )}
                <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Camera className="size-4" />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">Juan Toro</span>
                <span className="block truncate text-xs text-muted-foreground">
                  Administrador
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
                  {reports.length} reportes registrados
                </p>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground">
                Datos mock
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <ReportsTable
                reports={reports}
                onStatusChange={handleStatusChange}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
