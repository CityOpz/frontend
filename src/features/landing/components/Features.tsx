import { Construction, Lightbulb, Trees, CheckCircle2 } from "lucide-react"

import streetPavement from "../assets/images/street-pavement.png"
import streetLighting from "../assets/images/street-lighting.png"

export function Features() {
  return (
    <section className="py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Servicios de Mantenimiento
          </h2>
          <p className="text-lg text-muted-foreground">
            Detecta y reporta cualquier problema en los servicios públicos de tu zona.
          </p>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Potholes Feature */}
          <div 
            className="col-span-12 md:col-span-8 group relative overflow-hidden rounded-2xl glass-card p-6 border-t-4 border-chart-1 transition-all hover:border-chart-1/80"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start h-full">
              <div className="flex-1 space-y-4">
                <span 
                  className="text-chart-1 p-2 rounded-lg inline-block"
                  style={{
                    background: `color-mix(in oklch, var(--chart-1) 10%, transparent)`
                  }}
                >
                  <Construction className="w-10 h-10" />
                </span>
                <h3 className="text-2xl font-semibold text-foreground">
                  Baches y Pavimento
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Reporta daños en las vías para prevenir accidentes y mejorar el flujo de tráfico. Nuestro equipo de respuesta rápida prioriza las zonas escolares y de hospitales con mucho tráfico.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-foreground text-sm">
                    <CheckCircle2 className="text-chart-1 w-4 h-4" />
                    Geolocalización precisa
                  </li>
                  <li className="flex items-center gap-2 text-foreground text-sm">
                    <CheckCircle2 className="text-chart-1 w-4 h-4" />
                    Adjuntar evidencia fotográfica
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full h-48 md:h-full min-h-50 rounded-xl overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  src={streetPavement}
                  alt="Reparación vial"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background to-transparent md:bg-linear-to-l opacity-60"></div>
              </div>
            </div>
          </div>
          
          {/* Lighting Feature */}
          <div className="col-span-12 md:col-span-4 group glass-card p-6 rounded-2xl border-t-4 border-chart-3 transition-all hover:-translate-y-1">
            <span 
              className="text-chart-3 p-2 rounded-lg inline-block mb-4"
              style={{
                background: `color-mix(in oklch, var(--chart-3) 10%, transparent)`
              }}
            >
              <Lightbulb className="w-10 h-10" />
            </span>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Alumbrado Público
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Calles seguras gracias a un alumbrado público eficiente. Reporta farolas rotas o parpadeantes.
            </p>
            <img 
              className="w-full h-40 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-all"
              src={streetLighting}
              alt="Iluminación urbana"
            />
          </div>
          
          {/* Urban Furniture Feature */}
          <div className="col-span-12 md:col-span-4 group glass-card p-6 rounded-2xl border-t-4 border-chart-2 transition-all hover:-translate-y-1">
            <span 
              className="text-chart-2 p-2 rounded-lg inline-block mb-4"
              style={{
                background: `color-mix(in oklch, var(--chart-2) 10%, transparent)`
              }}
            >
              <Trees className="w-10 h-10" />
            </span>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Mobiliario Urbano
            </h3>
            <p className="text-muted-foreground text-sm">
              Bancos, papeleras y parques infantiles en óptimas condiciones. Ayúdanos a mantener los espacios públicos en buen estado.
            </p>
          </div>
          
          {/* Additional Context Card */}
          <div className="col-span-12 md:col-span-8 bg-card p-6 rounded-2xl border border-border flex items-center justify-between">
            <div className="max-w">
              <h4 className="text-xl font-medium text-foreground mb-1">
                ¿No encuentras la categoría?
              </h4>
              <p className="text-muted-foreground text-sm">
                Usa nuestra categoría 'Otro' para reportar cualquier problema que no esté listado. Nuestros operadores lo clasificarán manualmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}