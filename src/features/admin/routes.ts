import type { RouteObject } from "react-router"
import { requireAuth } from "@/shared/lib/router-helpers"
import DashboardPage from "./pages/DashboardPage"

export const adminRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    Component: DashboardPage,
    loader: () => requireAuth(),
  },
]
