import type { RouteObject } from "react-router"
import { requireAuth } from "@/shared/lib/router-helpers"
import ReportsMapPage from "./pages/ReportsMapPage"
import CreateReportPage from "./pages/CreateReportPage"

export const reportsRoutes: RouteObject[] = [
  {
    path: "/map",
    Component: ReportsMapPage,
    loader: () => requireAuth(),
  },
  {
    path: "/reports/new",
    Component: CreateReportPage,
    loader: () => requireAuth(),
  },
]
