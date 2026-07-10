import { useAuthStore } from "@/features/auth/store/auth.store"
import AdminDashboardPage from "./AdminDashboardPage"
import CitizenDashboardPage from "@/features/reports/pages/CitizenDashboardPage"

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  if (user?.role === "ADMIN") {
    return <AdminDashboardPage />
  }

  return <CitizenDashboardPage />
}
