import * as React from "react"
import { cn } from "@/shared/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.ComponentProps<"table">
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))

Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead">
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b border-border bg-muted/50", className)}
    {...props}
  />
))

TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody">
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-border", className)}
    {...props}
  />
))

TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<"tr">
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("transition-colors hover:bg-muted/40", className)}
    {...props}
  />
))

TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"th">
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 whitespace-nowrap px-5 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      className,
    )}
    {...props}
  />
))

TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"td">
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("whitespace-nowrap px-5 py-4 align-middle", className)}
    {...props}
  />
))

TableCell.displayName = "TableCell"

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
