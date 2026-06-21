import { createBrowserRouter } from "react-router"
import RootLayout from "./layouts/RootLayout"

import { landingRoutes } from "@/features/landing/routes"
import { authRoutes } from "@/features/auth/routes"

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [...landingRoutes, ...authRoutes],
  },
])
