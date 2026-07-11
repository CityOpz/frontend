import { Map } from "lucide-react"

import map from "../assets/images/map.avif"

export function MapPreview() {
  return (
    <section className="py-12 bg-muted overflow-hidden">
      <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Transparencia Total
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Nuestro mapa interactivo muestra todos los reportes activos, en progreso y resueltos. Filtra por categoría y mira cómo CityOps está transformando tu vecindario minuto a minuto.
          </p>
          <div className="flex gap-4">
            <div className="bg-card p-4 rounded-xl border border-border flex-1">
              <div className="text-chart-5 font-bold">45</div>
              <div className="text-xs text-muted-foreground uppercase tracking-tighter">
                Pendientes
              </div>
            </div>
            <div className="bg-card p-4 rounded-xl border border-border flex-1">
              <div className="text-chart-1 font-bold">128</div>
              <div className="text-xs text-muted-foreground uppercase tracking-tighter">
                En Progreso
              </div>
            </div>
            <div className="bg-card p-4 rounded-xl border border-border flex-1">
              <div className="text-chart-4 font-bold">1,042</div>
              <div className="text-xs text-muted-foreground uppercase tracking-tighter">
                Completados
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border relative group">
          <div 
            className="absolute inset-0 group-hover:opacity-0 transition-opacity z-10 pointer-events-none"
            style={{
              background: `color-mix(in oklch, var(--chart-1) 10%, transparent)`
            }}
          ></div>
          <img 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            src={map}
            alt="Mapa interactivo de la ciudad"
          />
          <div className="absolute bottom-4 left-4 z-20 bg-background/90 backdrop-blur p-2 rounded-lg border border-border flex items-center gap-2">
            <Map className="text-chart-1 w-4 h-4" />
            <span className="text-xs font-bold text-foreground uppercase">
              Vista en vivo: Centro Histórico
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}