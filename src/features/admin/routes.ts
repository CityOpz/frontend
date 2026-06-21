import type { RouteObject } from "react-router"
import { requireAuth } from "@/shared/lib/router-helpers"
import AdminDashboardPage from "./pages/AdminDashboardPage"

export const adminRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    Component: AdminDashboardPage,
    loader: () => requireAuth(),
  },
]
