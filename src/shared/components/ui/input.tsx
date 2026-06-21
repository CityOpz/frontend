import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      startIcon,
      endIcon,
      id,
      placeholder = " ",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    return (
      <div className="space-y-1">
        <div className="relative">
          {startIcon && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-outline">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={cn(
              "peer w-full bg-transparent",
              "border-0 border-b",
              "transition-all duration-200",
              "placeholder-transparent",
              "py-3",
              startIcon && "pl-8",
              endIcon && "pr-8",
              "border-outline/30",
              "text-foreground/90",
              "focus:border-primary",
              "focus:outline-none",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50",
              "aria-invalid:border-red-500",
              "aria-invalid:focus:border-red-500",
              className
            )}
            {...props}
          />

          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute left-0",
                "transition-all duration-200",
                "-top-3.5 text-sm text-outline",
                "peer-placeholder-shown:top-3",
                "peer-placeholder-shown:text-base",
                "peer-focus:-top-3.5",
                "peer-focus:text-sm",
                "peer-focus:text-primary",
                "peer-not-placeholder-shown:-top-3.5",
                "peer-not-placeholder-shown:text-sm",
                startIcon && "left-8",
                "aria-invalid:text-red-500",
                "peer-focus:aria-invalid:text-red-500",
                "peer-not-placeholder-shown:aria-invalid:text-red-500"
              )}
            >
              {label}
            </label>
          )}

          {endIcon && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-outline">
              {endIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }