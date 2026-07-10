import { MapPin } from "lucide-react"
import { Link } from "react-router"
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
import {
  canTransitionReportStatus,
  REPORT_STATUSES,
} from "../utils/report-status"

interface ReportsTableProps {
  readonly reports: readonly Report[]
  readonly onStatusChange: (reportId: string, status: ReportStatus) => void
  readonly updatingReportId?: string | null
}

const statusStyles: Record<ReportStatus, string> = {
  Pendiente: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "En revisión": "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "En reparación": "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  Resuelto: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
}

const coordinateFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

export function ReportsTable({
  reports,
  onStatusChange,
  updatingReportId,
}: ReportsTableProps) {
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
            <TableCell className="font-semibold">
              <Link to={`/reports/${report.id}`} className="text-primary hover:underline hover:text-primary/80">
                {report.id}
              </Link>
            </TableCell>
            <TableCell className="min-w-72 whitespace-normal font-medium text-foreground">
              <Link to={`/reports/${report.id}`} className="hover:underline hover:text-primary">
                {report.title}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {report.category}
            </TableCell>
            <TableCell>
              <div className="flex min-w-44 flex-col items-start gap-2">
                <Badge className={statusStyles[report.status]}>
                  {report.status}
                </Badge>
                <select
                  aria-label={`Cambiar estado del reporte ${report.id}`}
                  className="h-9 w-full cursor-pointer rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                  disabled={
                    report.status === "Resuelto" || updatingReportId === report.id
                  }
                  value={report.status}
                  onChange={(event) => {
                    const nextStatus = event.target.value as ReportStatus

                    if (canTransitionReportStatus(report.status, nextStatus)) {
                      onStatusChange(report.id, nextStatus)
                    }
                  }}
                >
                  {REPORT_STATUSES.map((status) => (
                    <option
                      key={status}
                      disabled={!canTransitionReportStatus(report.status, status)}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <MapPin aria-hidden="true" className="size-4 text-primary" />
                {coordinateFormatter.format(report.coordinates.latitude)},{" "}
                {coordinateFormatter.format(report.coordinates.longitude)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
