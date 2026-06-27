import { useState, type SubmitEventHandler } from "react"
import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Send,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

const REPORT_CATEGORIES = [
  "Infraestructura vial",
  "Alumbrado público",
  "Aseo y residuos",
  "Movilidad",
  "Espacio público",
  "Servicios públicos",
] as const

interface ReportFormState {
  readonly title: string
  readonly description: string
  readonly category: string
  readonly latitude: string
  readonly longitude: string
}

interface ReportFormErrors {
  readonly title?: string
  readonly description?: string
  readonly latitude?: string
  readonly longitude?: string
  readonly location?: string
}

const initialForm: ReportFormState = {
  title: "",
  description: "",
  category: REPORT_CATEGORIES[0],
  latitude: "",
  longitude: "",
}

export function CreateReportForm() {
  const [form, setForm] = useState<ReportFormState>(initialForm)
  const [errors, setErrors] = useState<ReportFormErrors>({})
  const [isLocating, setIsLocating] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateField = (field: keyof ReportFormState, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setIsSubmitted(false)

    if (field === "title" || field === "description") {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    }

    if (field === "latitude" || field === "longitude") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
        location: undefined,
      }))
    }
  }

  const handleLocation = () => {
    setIsSubmitted(false)

    if (!navigator.geolocation) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        location: "La geolocalización no está disponible en este navegador.",
      }))
      return
    }

    setIsLocating(true)
    setErrors((currentErrors) => ({ ...currentErrors, location: undefined }))

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((currentForm) => ({
          ...currentForm,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6),
        }))
        setIsLocating(false)
      },
      () => {
        setErrors((currentErrors) => ({
          ...currentErrors,
          location: "No fue posible obtener tu ubicación. Revisa los permisos del navegador.",
        }))
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const validationErrors: ReportFormErrors = {
      title: form.title.trim() ? undefined : "El título es obligatorio.",
      description: form.description.trim()
        ? undefined
        : "La descripción es obligatoria.",
      latitude:
        form.latitude.trim() && Number.isNaN(Number(form.latitude))
          ? "Ingresa una latitud válida."
          : undefined,
      longitude:
        form.longitude.trim() && Number.isNaN(Number(form.longitude))
          ? "Ingresa una longitud válida."
          : undefined,
    }

    setErrors((currentErrors) => ({
      ...validationErrors,
      location: currentErrors.location,
    }))

    if (
      validationErrors.title ||
      validationErrors.description ||
      validationErrors.latitude ||
      validationErrors.longitude
    ) {
      setIsSubmitted(false)
      return
    }

    setIsSubmitted(true)
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <Input
        error={errors.title}
        id="report-title"
        label="Título"
        maxLength={120}
        name="title"
        onChange={(event) => updateField("title", event.target.value)}
        startIcon={<FileText className="size-4" />}
        value={form.title}
      />

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="report-description">
          Descripción
        </label>
        <textarea
          aria-invalid={Boolean(errors.description)}
          className="min-h-36 w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-red-500"
          id="report-description"
          maxLength={800}
          name="description"
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe qué está ocurriendo y brinda detalles que ayuden a identificar el problema."
          value={form.description}
        />
        {errors.description && (
          <p className="text-xs font-medium text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="report-category">
          Categoría
        </label>
        <select
          className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          id="report-category"
          name="category"
          onChange={(event) => updateField("category", event.target.value)}
          value={form.category}
        >
          {REPORT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <input name="latitude" type="hidden" value={form.latitude} readOnly />
      <input name="longitude" type="hidden" value={form.longitude} readOnly />

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Ubicación del reporte</p>
            {form.latitude && form.longitude ? (
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Ubicación obtenida: {form.latitude}, {form.longitude}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Permite el acceso para asociar el reporte a tu ubicación actual.
              </p>
            )}
          </div>
          <Button
            disabled={isLocating}
            leftIcon={
              isLocating ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <LocateFixed />
              )
            }
            type="button"
            variant="outline"
            onClick={handleLocation}
          >
            {isLocating ? "Obteniendo ubicación..." : "Obtener mi ubicación"}
          </Button>
        </div>
        {errors.location && (
          <p className="mt-3 text-xs font-medium text-red-500" role="alert">
            {errors.location}
          </p>
        )}

        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <p className="text-sm font-semibold">Ingresar ubicación manualmente</p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              error={errors.latitude}
              id="manual-latitude"
              inputMode="decimal"
              label="Latitud"
              onChange={(event) => updateField("latitude", event.target.value)}
              placeholder="4.711000"
              type="text"
              value={form.latitude}
            />
            <Input
              error={errors.longitude}
              id="manual-longitude"
              inputMode="decimal"
              label="Longitud"
              onChange={(event) => updateField("longitude", event.target.value)}
              placeholder="-74.072100"
              type="text"
              value={form.longitude}
            />
          </div>
        </div>
      </div>

      {isSubmitted && (
        <output
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Reporte creado correctamente</p>
            <p className="mt-1 text-xs opacity-80">
              El envío es local mientras se completa la integración con el backend.
            </p>
          </div>
        </output>
      )}

      <Button fullWidth leftIcon={<Send />} size="lg" type="submit">
        Crear reporte
      </Button>
    </form>
  )
}
