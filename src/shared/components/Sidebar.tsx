import { useState, useRef, useEffect, type ChangeEventHandler } from "react"
import { Link } from "react-router"
import { Camera, ChevronDown, ImagePlus, LogOut, Trash2 } from "lucide-react"
import { useAuthStore } from "@/features/auth/store/auth.store"

// ✅ CORREGIDO: Cambiar el tipo de icon para aceptar iconos de Lucide
interface NavItem {
  label: string
  icon: React.ElementType  // ✅ Tipo correcto sin any
  path?: string
  active?: boolean
}

interface SidebarProps {
  panelName: string
  menuTitle: string
  navItems: NavItem[]
}

export function Sidebar({ panelName, menuTitle, navItems }: SidebarProps) {
  const user = useAuthStore((s) => s.user)
  const userFullName = user ? `${user.first_name} ${user.last_name}` : "Juan Toro"
  const userRole = user?.role === "ADMIN" ? "Administrador" : user?.role === "CITIZEN" ? "Ciudadano" : "Administrador"
  const userInitials = user ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase() || "US" : "JT"

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
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">
          C
        </div>
        <div>
          <p className="text-lg font-black tracking-tight">CityOpz</p>
          <p className="text-xs text-muted-foreground">{panelName}</p>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 space-y-1 p-4">
        <p className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {menuTitle}
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
                  alt={`Foto de perfil de ${userFullName}`}
                  className="size-full object-cover"
                  src={profilePhotoUrl}
                />
              ) : (
                userInitials
              )}
              <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Camera className="size-4" />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{userFullName}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {userRole}
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
              <Link
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400"
                to="/logout"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}