import { useState, type ChangeEventHandler, type SubmitEventHandler } from "react"
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  ImagePlus,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Send,
} from "lucide-react"
import type { AxiosError } from "axios"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { REPORT_CATEGORY_OPTIONS, reportsService } from "../services/reports.service"

interface ReportFormState {
  readonly title: string
  readonly description: string
  readonly category: string
  readonly latitude: string
  readonly longitude: string
  readonly photo: File | null
}

interface ReportFormErrors {
  readonly title?: string
  readonly description?: string
  readonly latitude?: string
  readonly longitude?: string
  readonly location?: string
  readonly submit?: string
}

const initialForm: ReportFormState = {
  title: "",
  description: "",
  category: String(REPORT_CATEGORY_OPTIONS[0].id),
  latitude: "",
  longitude: "",
  photo: null,
}

export function CreateReportForm() {
  const [form, setForm] = useState<ReportFormState>(initialForm)
  const [errors, setErrors] = useState<ReportFormErrors>({})
  const [isLocating, setIsLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handlePhotoChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setIsSubmitted(false)
    setForm((currentForm) => ({
      ...currentForm,
      photo: event.target.files?.[0] ?? null,
    }))
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

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const validationErrors: ReportFormErrors = {
      title: form.title.trim() ? undefined : "El título es obligatorio.",
      description: form.description.trim()
        ? undefined
        : "La descripción es obligatoria.",
      latitude:
        !form.latitude.trim()
          ? "La latitud es obligatoria."
          : Number.isNaN(Number(form.latitude))
          ? "Ingresa una latitud válida."
          : undefined,
      longitude:
        !form.longitude.trim()
          ? "La longitud es obligatoria."
          : Number.isNaN(Number(form.longitude))
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

    setIsSubmitting(true)
    setIsSubmitted(false)

    try {
      await reportsService.create({
        title: form.title.trim(),
        detail: form.description.trim(),
        categoryId: Number(form.category),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        photo: form.photo,
      })

      setForm(initialForm)
      setErrors({})
      setIsSubmitted(true)
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>

      setErrors((currentErrors) => ({
        ...currentErrors,
        submit:
          axiosError.response?.data?.detail ??
          "No fue posible crear el reporte. Inténtalo nuevamente.",
      }))
    } finally {
      setIsSubmitting(false)
    }
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
          {REPORT_CATEGORY_OPTIONS.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="report-photo">
          Foto
        </label>
        <label
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          htmlFor="report-photo"
        >
          <ImagePlus className="size-5 text-primary" />
          <span className="min-w-0 truncate">
            {form.photo ? form.photo.name : "Adjuntar imagen opcional"}
          </span>
        </label>
        <input
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          id="report-photo"
          name="photo"
          onChange={handlePhotoChange}
          type="file"
        />
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
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Reporte creado correctamente</p>
            <p className="mt-1 text-xs opacity-80">
              La incidencia ya fue enviada al backend para su revisión.
            </p>
          </div>
        </output>
      )}

      {errors.submit && (
        <p
          className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-300"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errors.submit}
        </p>
      )}

      <Button
        disabled={isSubmitting}
        fullWidth
        leftIcon={isSubmitting ? <LoaderCircle className="animate-spin" /> : <Send />}
        size="lg"
        type="submit"
      >
        {isSubmitting ? "Creando reporte..." : "Crear reporte"}
      </Button>
    </form>
  )
}
