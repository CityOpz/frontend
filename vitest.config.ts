import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
 
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        "src/**/routes.ts",
        "src/**/pages/**",
        "src/**/*Hero.tsx",
        "src/**/*.types.ts",
        "src/**/*.variants.ts",
        "src/main.tsx",
        "src/app/routes.ts",
        "src/app/layouts/**",
        "src/shared/lib/api/authInterceptor.ts",
        "src/shared/components/ui/badge.tsx",
        "src/shared/components/ui/card.tsx",
        "src/shared/hooks/useDocumentTitle.ts",
        "src/shared/theme/**",
      ],
    },
  },
})