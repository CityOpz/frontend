import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router"
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  LoaderCircle,
  MapPin,
  Tag,
  User as UserIcon,
  Clock,
  Image as ImageIcon,
} from "lucide-react"
import L from "leaflet"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import markerIconUrl from "leaflet/dist/images/marker-icon.png"
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png"

import useDocumentTitle from "@/shared/hooks/useDocumentTitle"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import ThemeToggle from "@/shared/theme/components/ThemeToggle"
import { reportsService } from "../services/reports.service"
import type { ApiReport } from "../types/report-api.types"

import { Button } from "@/shared/components/ui/button"

import "leaflet/dist/leaflet.css"

const reportMarkerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

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

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  useDocumentTitle(`Reporte ${id ? `REP-${id.padStart(3, "0")}` : ""}`)

  const [report, setReport] = useState<ApiReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let isMounted = true

    async function fetchDetail() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await reportsService.detail(Number(id))
        if (isMounted) {
          setReport(response.data)
        }
      } catch (err: any) {
        if (isMounted) {
          if (err.response?.status === 404) {
            setError("El reporte solicitado no existe o no tienes permisos para verlo.")
          } else {
            setError("Ocurrió un error al cargar el detalle del reporte.")
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchDetail()

    return () => {
      isMounted = false
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-8">
            <Link className="flex items-center gap-3" to="/dashboard">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">C</span>
              <span className="text-lg font-black tracking-tight">CityOpz</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <LoaderCircle className="size-6 animate-spin text-primary" />
            Cargando detalle del reporte...
          </div>
        </main>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-8">
            <Link className="flex items-center gap-3" to="/dashboard">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">C</span>
              <span className="text-lg font-black tracking-tight">CityOpz</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="size-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold mb-2">Error al cargar el reporte</h1>
          <p className="text-sm text-muted-foreground max-w-md mb-6">{error || "No se pudo encontrar el reporte."}</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Volver al dashboard
          </Button>
        </main>
      </div>
    )
  }

  const formattedId = `REP-${String(report.id).padStart(3, "0")}`
  const categoryLabel = report.category?.name ?? "Sin categoría"
  const hasCoordinates = report.latitude !== undefined && report.longitude !== undefined
  const reportPosition: [number, number] = [report.latitude ?? 0, report.longitude ?? 0]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-8">
          <Link
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            to="/dashboard"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">
              C
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">CityOpz</span>
              <span className="block text-xs text-muted-foreground">Detalle del reporte</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              to="/dashboard"
            >
              <ArrowLeft className="size-4" />
              Volver al panel
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 sm:p-8 space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="border-primary/20 bg-primary/10 text-primary font-mono">
                {formattedId}
              </Badge>
              <Badge className={statusStyles[report.status] || ""}>
                {API_STATUS_TO_LABEL[report.status] || report.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight">{report.title}</h1>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border p-6">
                <h2 className="text-lg font-bold text-foreground">Detalles de la incidencia</h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{report.detail}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-border/60">
                  <div className="flex items-center gap-3 text-sm">
                    <Tag className="size-5 text-primary shrink-0" />
                    <div>
                      <span className="block text-xs text-muted-foreground">Categoría</span>
                      <span className="font-semibold">{categoryLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <UserIcon className="size-5 text-primary shrink-0" />
                    <div>
                      <span className="block text-xs text-muted-foreground">Reportado por</span>
                      <span className="font-semibold">
                        {report.created_by
                          ? `${report.created_by.first_name} ${report.created_by.last_name}`
                          : "Ciudadano"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="size-5 text-primary shrink-0" />
                    <div>
                      <span className="block text-xs text-muted-foreground">Fecha de creación</span>
                      <span className="font-semibold">
                        {report.created_at
                          ? new Date(report.created_at).toLocaleString("es-CO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "Sin fecha"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="size-5 text-primary shrink-0" />
                    <div>
                      <span className="block text-xs text-muted-foreground">Última actualización</span>
                      <span className="font-semibold">
                        {report.updated_at
                          ? new Date(report.updated_at).toLocaleString("es-CO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "Sin fecha"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {hasCoordinates && (
              <Card className="border-border bg-card overflow-hidden">
                <CardHeader className="border-b border-border p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">Ubicación geográfica</h2>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" />
                      {coordinateFormatter.format(report.latitude!)},{" "}
                      {coordinateFormatter.format(report.longitude!)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[320px] relative z-0">
                  <MapContainer
                    center={reportPosition}
                    className="h-full w-full"
                    zoom={15}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker icon={reportMarkerIcon} position={reportPosition} />
                  </MapContainer>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card overflow-hidden">
              <CardHeader className="border-b border-border p-6">
                <h2 className="text-lg font-bold text-foreground">Evidencia fotográfica</h2>
              </CardHeader>
              <CardContent className="p-6">
                {report.photo ? (
                  <div className="group relative rounded-xl overflow-hidden border border-border bg-muted aspect-square flex items-center justify-center">
                    <img
                      alt={`Evidencia de la incidencia ${formattedId}`}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      src={report.photo}
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                    <ImageIcon className="size-10 text-muted-foreground/60 mb-3" />
                    <p className="text-sm font-semibold text-muted-foreground">Sin foto adjunta</p>
                    <p className="text-xs text-muted-foreground/80 mt-1 max-w-[180px]">El ciudadano no adjuntó una imagen de evidencia para este reporte.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
