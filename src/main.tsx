import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"
import ThemeProvider from "./shared/theme/providers/ThemeProvider"
import { router } from "./app/routes"

import "./shared/lib/api/authInterceptor"
import "./app/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
        <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
