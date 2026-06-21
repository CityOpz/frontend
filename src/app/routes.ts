import { createBrowserRouter } from "react-router"
import RootLayout from "./layouts/RootLayout"

import { landingRoutes } from "@/features/landing/routes"
import { authRoutes } from "@/features/auth/routes"
import { adminRoutes } from "@/features/admin/routes"
import { reportsRoutes } from "@/features/reports/routes"

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      ...landingRoutes,
      ...authRoutes,
      ...adminRoutes,
      ...reportsRoutes,
    ],
  },
])