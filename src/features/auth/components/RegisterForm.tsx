import { useState } from "react"
import {
  User,
  UserCircle,
  AtSign,
  Mail,
  Lock,
  LockKeyhole,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { PasswordInput } from "./PasswordInput"
import { PasswordRequirements } from "./PasswordRequirements"
import { Link } from "react-router"

import { useRegisterForm } from "../hooks/useRegisterForm"

export function RegisterForm() {
  const {
    form,
    errors,
    termsError,
    submitError,
    loading,
    submit,
    update,
    validateField,
  } = useRegisterForm()

  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  const showRequirements = passwordFocused || confirmPasswordFocused

  return (
    <main className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-8 overflow-y-auto bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Lock className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-primary">CityOps</span>
        </div>

        <header className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Crear una cuenta
          </h2>
          <p className="text-sm text-muted-foreground">
            Accede a la suite de gestión urbana.
          </p>
        </header>

        <form className="flex flex-col gap-y-4" onSubmit={submit}>
          {submitError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="Nombre"
              type="text"
              placeholder="Johnathan"
              value={form.firstName}
              onChange={(e) => update("firstName")(e.target.value)}
              onBlur={(e) => validateField("firstName", e.target.value)}
              error={errors.firstName}
              startIcon={<User className="w-5 h-5" />}
            />

            <Input
              id="lastName"
              label="Apellido"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => update("lastName")(e.target.value)}
              onBlur={(e) => validateField("lastName", e.target.value)}
              error={errors.lastName}
              startIcon={<UserCircle className="w-5 h-5" />}
            />
          </div>

          <Input
            id="username"
            label="Nombre de usuario"
            type="text"
            placeholder="jdoe_official"
            value={form.username}
            onChange={(e) => update("username")(e.target.value)}
            onBlur={(e) => validateField("username", e.target.value)}
            error={errors.username}
            startIcon={<AtSign className="w-5 h-5" />}
          />

          <Input
            id="email"
            label="Correo electrónico"
            type="email"
            placeholder="j.doe@email.com"
            value={form.email}
            onChange={(e) => update("email")(e.target.value.toLowerCase())}
            onBlur={(e) => validateField("email", e.target.value)}
            error={errors.email}
            startIcon={<Mail className="w-5 h-5" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              id="password"
              label="Contraseña"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password")(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={(e) => {
                setPasswordFocused(false)
                validateField("password", e.target.value)
              }}
              error={errors.password}
              startIcon={<Lock className="w-5 h-5" />}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirmar contraseña"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword")(e.target.value)}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={(e) => {
                setConfirmPasswordFocused(false)
                validateField("confirmPassword", e.target.value)
              }}
              error={errors.confirmPassword}
              startIcon={<LockKeyhole className="w-5 h-5" />}
            />
          </div>

          <PasswordRequirements
            password={form.password}
            confirmPassword={form.confirmPassword}
            visible={showRequirements}
          />

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={form.acceptTerms}
                onChange={(e) => update("acceptTerms")(e.target.checked)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                Acepto los Términos de Servicio y la Política de Privacidad sobre el manejo de datos.
              </label>
            </div>

            {termsError && (
              <p className="text-xs text-red-500 font-medium ml-8">
                {termsError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="mt-2"
          >
            Crear Cuenta
          </Button>
        </form>

        <footer className="pt-4">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link className="text-primary font-bold hover:underline ml-1" to="/login">
              Iniciar Sesión
            </Link>
          </p>
        </footer>
      </div>
    </main>
  )
}
