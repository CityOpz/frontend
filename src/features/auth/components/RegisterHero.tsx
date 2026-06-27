import { Building2, BarChart3 } from "lucide-react"
import ThemeToggle from "@/shared/theme/components/ThemeToggle"

import "../styles/auth.css"
import { Link } from "react-router"

export function RegisterHero() {
  return (
    <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background border-r border-border items-center justify-center p-12">
      <div className="grid-background absolute inset-0" />

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-lg space-y-6">
        <Link to="/">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center glow-accent">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter text-primary">
              CityOps
            </span>
          </div>
        </Link>


        <h1 className="text-5xl font-bold leading-tight text-foreground">
          Architecting <br />
          <span className="text-primary">Urban Intelligence</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          The mission control for the next generation of smart cities. Empowering
          officials and citizens with real-time operational transparency.
        </p>

        <div className="glass-card p-6 rounded-xl flex items-center gap-4 floating-ui">
          <div className="p-2 bg-secondary-container rounded-lg">
            <BarChart3 className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-xs text-primary uppercase tracking-widest font-semibold">
              Active Infrastructure
            </p>
            <p className="text-xl text-foreground font-medium">
              99.8% System Efficiency
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-20">
        <ThemeToggle />
      </div>
    </aside>
  )
}
