import { Landmark, ArrowRight, User, LockKeyhole } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { PasswordInput } from "./PasswordInput"

import { useLoginForm } from "../hooks/useLoginForm"
import { Link } from "react-router"

export function LoginForm() {
  const { form, loading, error, submit, update } = useLoginForm()

  return (
    <section className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-8 overflow-y-auto bg-background">
      <Link to="/" className="mb-16 flex items-center gap-3 self-start">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-background">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-foreground tracking-tight uppercase">
              City<span className="text-primary">Ops</span>
            </span>
            <span className="block text-[10px] text-outline tracking-[0.2em] uppercase font-bold">
              GovTech Portal
            </span>
          </div>
      </Link>


      <div className="max-w-100 w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-outline">
            Identify yourself to continue to the dashboard.
          </p>
        </header>

        <form className="space-y-12 mt-10" onSubmit={submit}>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-10">
            <Input
              id="username"
              label="Username"
              type="text"
              value={form.username}
              onChange={(e) => update("username")(e.target.value)}
              startIcon={<User className="w-5 h-5" />}
            />

            <PasswordInput
              id="password"
              label="Password"
              value={form.password}
              onChange={(e) => update("password")(e.target.value)}
              startIcon={<LockKeyhole className="w-5 h-5" />}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="rounded-sm"
          >
            Access System
          </Button>
        </form>

        <div className="mt-12 text-center lg:text-left">
          <p className="text-sm text-outline">
            New to CityOps?{" "}
            <a
              className="text-primary font-bold hover:underline"
              href="/register"
            >
              Create your account
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
