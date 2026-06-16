import { createBrowserRouter } from "react-router"

import RootLayout from "./layouts/RootLayout"

import { landingRoutes } from "@/features/landing/routes"

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      ...landingRoutes
    ]
  }
])
