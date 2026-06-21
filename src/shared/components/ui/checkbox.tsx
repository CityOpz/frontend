import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  description?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id ?? generatedId

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              "peer absolute opacity-0 size-0",
              className
            )}
            {...props}
          />

          <label
            htmlFor={checkboxId}
            className={cn(
              "flex size-5 shrink-0 items-center justify-center",
              "rounded border-2 border-outline/30",
              "bg-transparent transition-all duration-200",
              "cursor-pointer",
              "peer-hover:border-primary/50",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-checked:border-primary peer-checked:bg-primary",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "[&>svg]:opacity-0 [&>svg]:transition-opacity",
              "peer-checked:[&>svg]:opacity-100"
            )}
          >
            <Check className="size-3.5 text-background stroke-3" />
          </label>
        </div>

        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-outline">{description}</p>}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox, type CheckboxProps }