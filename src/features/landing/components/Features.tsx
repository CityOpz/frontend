import { Construction, Lightbulb, Trees, CheckCircle2 } from "lucide-react"

import streetPavement from "../assets/images/street-pavement.png"
import streetLighting from "../assets/images/street-lighting.png"

export function Features() {
  return (
    <section className="py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Maintenance Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Detect and report any issues in public services in your area.
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
                  Potholes & Pavement
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Report road damage to prevent accidents and improve traffic flow. Our rapid response team prioritizes high-traffic school and hospital zones.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-foreground text-sm">
                    <CheckCircle2 className="text-chart-1 w-4 h-4" />
                    Accurate geolocation
                  </li>
                  <li className="flex items-center gap-2 text-foreground text-sm">
                    <CheckCircle2 className="text-chart-1 w-4 h-4" />
                    Attach photo evidence
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full h-48 md:h-full min-h-50 rounded-xl overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  src={streetPavement}
                  alt="Road repair"
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
              Street Lighting
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Safe streets thanks to efficient public lighting. Report broken or flickering streetlights.
            </p>
            <img 
              className="w-full h-40 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-all"
              src={streetLighting}
              alt="Urban lighting"
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
              Urban Furniture
            </h3>
            <p className="text-muted-foreground text-sm">
              Benches, trash bins, and playgrounds in optimal condition. Help us keep public spaces well maintained.
            </p>
          </div>
          
          {/* Additional Context Card */}
          <div className="col-span-12 md:col-span-8 bg-card p-6 rounded-2xl border border-border flex items-center justify-between">
            <div className="max-w">
              <h4 className="text-xl font-medium text-foreground mb-1">
                Can't find the category?
              </h4>
              <p className="text-muted-foreground text-sm">
                Use our 'Other' category to report any issue not listed. Our operators will classify it manually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}