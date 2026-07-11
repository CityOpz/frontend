import { Badge } from "@/shared/components/ui/badge"
import { AuthCard } from "./AuthCard"

export function Hero() {
  return (
    <section className="relative min-h-225 flex items-center overflow-hidden px-8 bg-background">
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% -20%, oklch(from var(--primary) l c h / 0.15) 0%, transparent 60%)`
        }}
      />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
          <Badge variant="tertiary" size="md" dot animated className="text-chart-3 bg-chart-3/15">
            Iniciativa Ciudad Inteligente 2026
          </Badge>
          
          <h1 className="text-5xl md:text-[64px] leading-tight text-foreground font-extrabold tracking-tight">
            Mejora tu ciudad, <span className="text-primary">un reporte a la vez</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Únete a miles de ciudadanos proactivos que transforman sus vecindarios. Tu participación impulsa una infraestructura urbana eficiente y transparente.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-foreground">12.4k</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Problemas Resueltos
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-foreground">48h</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Respuesta Promedio
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-foreground">92%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Satisfacción
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-foreground">150+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vecindarios Activos
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 flex justify-center lg:justify-end">
          <AuthCard />
        </div>
      </div>
    </section>
  )
}