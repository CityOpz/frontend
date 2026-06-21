import { ArrowLeft, ClipboardCheck, MapPin, ShieldCheck } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import ThemeToggle from "@/shared/theme/components/ThemeToggle"
import useDocumentTitle from "@/shared/hooks/useDocumentTitle"
import { CreateReportForm } from "../components/CreateReportForm"

export default function CreateReportPage() {
  useDocumentTitle("Crear reporte")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-8">
          <Link
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            to="/map"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">
              C
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">CityOpz</span>
              <span className="block text-xs text-muted-foreground">Participación ciudadana</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
              to="/map"
            >
              <ArrowLeft className="size-4" />
              Volver al mapa
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 p-4 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <section>
          <Badge className="mb-3 border-primary/20 bg-primary/10 text-primary">
            Nuevo reporte
          </Badge>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Cuéntanos qué está pasando
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Completa la información para que la incidencia pueda ser identificada y atendida.
          </p>

          <Card className="mt-7 border-border bg-card" padding="none">
            <CardHeader className="border-b border-border p-6">
              <h2 className="text-lg font-bold text-foreground">Información del reporte</h2>
              <p className="text-sm text-muted-foreground">
                Los campos marcados como obligatorios deben estar completos.
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-8 sm:p-8 sm:pt-10">
              <CreateReportForm />
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:pt-24">
          <Card className="border-border bg-card" padding="md">
            <div className="flex gap-3">
              <MapPin className="size-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-bold">Ubicación precisa</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Tu ubicación ayuda a encontrar la incidencia rápidamente.
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card" padding="md">
            <div className="flex gap-3">
              <ClipboardCheck className="size-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-bold">Describe el problema</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Incluye referencias y detalles útiles para el equipo encargado.
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card" padding="md">
            <div className="flex gap-3">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-bold">Información protegida</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Las coordenadas solo se utilizan para gestionar el reporte.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  )
}