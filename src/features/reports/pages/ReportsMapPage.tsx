import { useEffect, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Layers3,
  LoaderCircle,
  MapPin,
  Navigation,
  Plus,
} from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import ThemeToggle from "@/shared/theme/components/ThemeToggle"
import useDocumentTitle from "@/shared/hooks/useDocumentTitle"
import { ReportsMap } from "../components/ReportsMap"
import { reportsService } from "../services/reports.service"
import type { MapReport } from "../types/map-report.types"

export default function ReportsMapPage() {
  useDocumentTitle("Mapa de reportes")
  const [reports, setReports] = useState<readonly MapReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let isMounted = true

    async function loadReports() {
      try {
        const mapReports = await reportsService.listMapReports()

        if (isMounted) {
          setReports(mapReports)
          setError(undefined)
        }
      } catch {
        if (isMounted) {
          setError("No fue posible cargar los reportes del mapa.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadReports()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center px-4 sm:px-8">
          <Link
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            to="/dashboard"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">
              C
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">CityOpz</span>
              <span className="block text-xs text-muted-foreground">Mapa ciudadano</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
              to="/dashboard"
            >
              <ArrowLeft className="size-4" />
              Volver al panel
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-8">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <Badge className="mb-3 border-primary/20 bg-primary/10 text-primary">
              <Navigation className="size-3.5" />
              Exploración geográfica
            </Badge>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Mapa de reportes
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Explora la ubicación de las incidencias registradas por la comunidad.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
              to="/reports/new"
            >
              <Plus className="size-4" />
              Crear reporte
            </Link>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
              <MapPin className="size-5 text-primary" />
              <div>
                <strong className="block text-lg leading-none">{reports.length}</strong>
                <span className="text-xs text-muted-foreground">Reportes visibles</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
              <Layers3 className="size-5 text-primary" />
              <div>
                <strong className="block text-sm leading-none">OpenStreetMap</strong>
                <span className="text-xs text-muted-foreground">Mapa interactivo</span>
              </div>
            </div>
          </div>
        </section>

        <Card
          aria-label="Mapa interactivo de reportes"
          className="relative min-h-[480px] overflow-hidden border-border bg-card sm:min-h-[620px]"
          padding="none"
        >
          {isLoading ? (
            <div className="grid min-h-[480px] place-items-center sm:min-h-[620px]">
              <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin text-primary" />
                Cargando reportes...
              </div>
            </div>
          ) : error ? (
            <div className="grid min-h-[480px] place-items-center p-6 text-center sm:min-h-[620px]">
              <div className="max-w-sm space-y-3">
                <AlertCircle className="mx-auto size-8 text-red-500" />
                <p className="text-sm font-semibold text-foreground">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <ReportsMap reports={reports} />
              <div className="pointer-events-none absolute bottom-7 left-4 z-[500] rounded-xl border border-white/20 bg-slate-950/80 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-md">
                {reports.length
                  ? "Selecciona un marcador para ver el reporte"
                  : "No hay reportes con ubicación para mostrar"}
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  )
}
