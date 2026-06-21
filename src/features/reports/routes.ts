import type { RouteObject } from "react-router"
import { requireAuth } from "@/shared/lib/router-helpers"
import ReportsMapPage from "./pages/ReportsMapPage"

export const reportsRoutes: RouteObject[] = [
  {
    path: "/map",
    Component: ReportsMapPage,
    loader: () => requireAuth(),
  },
]
