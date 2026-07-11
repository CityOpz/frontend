import { Link } from "react-router"
import { Button } from "@/shared/components/ui/button"
import { LogIn, UserPlus, Shield, Zap, Users } from "lucide-react"

export function AuthCard() {
  return (
    <div 
      className="relative w-full max-w-sm rounded-2xl p-8 border border-border shadow-2xl"
      style={{
        background: `color-mix(in oklch, var(--card) 70%, transparent)`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: `var(--chart-1)`
        }}
      />
      <div 
        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: `var(--chart-2)`
        }}
      />
      
      <div className="relative z-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-chart-1">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Acceso Seguro
            </span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Únete a CityOps
          </h3>
          <p className="text-sm text-muted-foreground">
            Comienza a transformar tu comunidad hoy.
          </p>
        </div>
        
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-3 text-sm">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `color-mix(in oklch, var(--chart-1) 15%, transparent)`
              }}
            >
              <Zap className="w-4 h-4 text-chart-1" />
            </div>
            <span className="text-foreground">Reportes en tiempo real</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `color-mix(in oklch, var(--chart-2) 15%, transparent)`
              }}
            >
              <Users className="w-4 h-4 text-chart-2" />
            </div>
            <span className="text-foreground">Comunidad activa</span>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <Link to="/login" className="block">
            <Button size="lg" className="w-full flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register" className="block">
            <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2 text-foreground">
              <UserPlus className="w-4 h-4" />
              Crear Cuenta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}