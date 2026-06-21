import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const cardVariants = cva(
  [
    "group/card",
    "flex",
    "flex-col",
    "rounded-2xl",
    "border",
    "bg-card",
    "text-card-foreground",
    "shadow-sm",
    "overflow-hidden",
  ],
  {
    variants: {
      variant: {
        default: "border-border",
        glass: [
          "bg-surface/70",
          "backdrop-blur-12",
          "border-white/10",
        ],
        interactive: [
          "hover:-translate-y-1",
          "hover:shadow-md",
          "transition-all",
          "duration-300",
          "cursor-pointer",
        ],
        elevated: [
          "shadow-lg",
          "shadow-primary/5",
          "border-transparent",
        ],
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
      {...props}
    />
  )
})

CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h3">
>(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("font-headline-md text-headline-md text-white", className)}
      {...props}
    >
      {children}
    </h3>
  )
})

CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-on-surface-variant font-body-md text-body-md", className)}
      {...props}
    />
  )
})

CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
})

CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center gap-3 p-6 pt-0", className)}
      {...props}
    />
  )
})

CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
