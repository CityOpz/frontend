import { Check, X } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { getPasswordRequirements } from "../utils/getPasswordRequirements"

interface PasswordRequirementsProps {
  readonly password: string
  readonly confirmPassword: string
  readonly visible: boolean
}

export function PasswordRequirements({
  password,
  confirmPassword,
  visible,
}: PasswordRequirementsProps) {
  if (!visible) return null

  const requirements = getPasswordRequirements(password, confirmPassword)

  return (
    <div className="mt-2 p-3 rounded-lg bg-surface-container border border-border/30 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      {requirements.map((req) => (
        <div
          key={req.id} // ✅ ID único en vez de index
          className={cn(
            "flex items-center gap-2 text-xs transition-colors",
            req.met ? "text-green-500" : "text-red-500"
          )}
        >
          {req.met ? (
            <Check className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  )
}