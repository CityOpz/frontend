import type { RouteObject } from "react-router"
import LoginPage from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import LogoutPage from "./pages/LogoutPage"

import { requireGuest } from "@/shared/lib/router-helpers"

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    Component: LoginPage,
    loader: () => requireGuest(),
  },
  {
    path: "/register",
    Component: RegisterPage,
    loader: () => requireGuest(),
  },
  {
    path: "/logout",
    Component: LogoutPage,
  },
]
