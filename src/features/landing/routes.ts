import type { RouteObject } from "react-router"
import { requireGuest } from "@/shared/lib/router-helpers"
import LandingPage from "./pages/LandingPage"

export const landingRoutes: RouteObject[] = [
  {
    index: true,
    Component: LandingPage,
    loader: () => requireGuest(),
  },
]
