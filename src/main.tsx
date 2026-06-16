import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ThemeProvider from './shared/theme/providers/ThemeProvider.tsx'
import { router } from './app/routes'
import { RouterProvider } from 'react-router'

import './app/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
