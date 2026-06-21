import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input, type InputProps } from "@/shared/components/ui/input"

type PasswordInputProps = Omit<InputProps, "type">

export function PasswordInput({
  onFocus,
  onBlur,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <Input
      {...props}
      type={show ? "text" : "password"}
      onFocus={(e) => {
        onFocus?.(e)
      }}
      onBlur={(e) => {
        onBlur?.(e)
      }}
      endIcon={
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      }
    />
  )
}
