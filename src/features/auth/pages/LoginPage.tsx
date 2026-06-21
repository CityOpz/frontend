import { LoginForm } from "../components/LoginForm"
import { LoginHero } from "../components/LoginHero"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex">
      <LoginHero />

      <section className="flex-1 flex items-center justify-center mx-auto">
        <LoginForm />
      </section>
    </main>
  )
}
