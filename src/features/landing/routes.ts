import type { RouteObject } from "react-router"

import LandingPage from "./pages/LandingPage"

export const landingRoutes: RouteObject[] = [
  {
    index: true,
    Component: LandingPage,
  },
]
