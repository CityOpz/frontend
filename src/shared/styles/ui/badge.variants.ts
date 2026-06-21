import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-1",
    "rounded-full",
    "px-3",
    "py-1",
    "text-xs",
    "font-medium",
    "transition-colors",
    "border",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-surface-container-high border-outline-variant text-on-surface",
        primary:
          "bg-primary-container/10 border-primary-container/20 text-primary-container",
        secondary:
          "bg-secondary/10 border-secondary/20 text-secondary",
        tertiary:
          "bg-tertiary/10 border-tertiary/20 text-tertiary",
        success:
          "bg-green-500/10 border-green-500/20 text-green-500",
        destructive:
          "bg-destructive/10 border-destructive/20 text-destructive",
        outline:
          "border-outline-variant text-on-surface-variant",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
      animated: {
        true: "animate-pulse-slow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)
