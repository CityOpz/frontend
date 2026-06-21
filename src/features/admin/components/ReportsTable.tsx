import { MapPin } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import type { Report, ReportStatus } from "../types/report.types"

interface ReportsTableProps {
  reports: Report[]
}

const statusStyles: Record<ReportStatus, string> = {
  Pendiente: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "En revisión": "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Resuelto: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
}

const coordinateFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <Table aria-label="Listado de reportes ciudadanos">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>ID</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Coordenadas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="font-semibold text-primary">
              {report.id}
            </TableCell>
            <TableCell className="min-w-72 whitespace-normal font-medium text-foreground">
              {report.title}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {report.category}
            </TableCell>
            <TableCell>
              <Badge className={statusStyles[report.status]}>
                {report.status}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <MapPin aria-hidden="true" className="size-4 text-primary" />
                {coordinateFormatter.format(report.coordinates.latitude)}, {" "}
                {coordinateFormatter.format(report.coordinates.longitude)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
