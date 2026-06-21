import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-xl",
    "text-sm",
    "font-bold",
    "transition-all",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-primary",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "active:scale-95",
    "[&_svg]:pointer-events-none",
    "[&_svg]:size-4",
    "[&_svg]:shrink-0",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline:
          "border border-outline-variant bg-background text-on-surface-variant hover:bg-surface-variant",
        ghost: "text-on-surface-variant hover:bg-surface-variant",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-lg",
        icon: "h-10 w-10",
      },
      loading: {
        true: "cursor-wait opacity-70",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)
