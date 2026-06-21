import { RegisterHero } from "../components/RegisterHero"
import { RegisterForm } from "../components/RegisterForm"

export function RegisterPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex">
      <RegisterHero />

      <section className="flex-1 flex items-center justify-center mx-auto">
        <RegisterForm />
      </section>
    </main>
  )
}
