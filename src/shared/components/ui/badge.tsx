import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"
import { badgeVariants } from "../../styles/ui/badge.variants"

export interface BadgeProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, animated, dot, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="badge"
        className={cn(
          badgeVariants({ variant, size, animated }),
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              variant === "primary" && "bg-primary-container",
              variant === "secondary" && "bg-secondary",
              variant === "tertiary" && "bg-chart-3",
              variant === "success" && "bg-green-500",
              variant === "destructive" && "bg-destructive",
              variant === "default" && "bg-on-surface",
              variant === "outline" && "bg-on-surface-variant"
            )}
          />
        )}
        {children}
      </div>
    )
  }
)

Badge.displayName = "Badge"

export { Badge }
