export interface PasswordRequirement {
  id: string
  label: string
  met: boolean
}

export function getPasswordRequirements(
  password: string,
  confirmPassword: string
): PasswordRequirement[] {
  return [
    {
      id: "length",
      label: "8-12 characters",
      met: password.length >= 8 && password.length <= 12,
    },
    {
      id: "uppercase",
      label: "At least 1 uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least 1 lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least 1 number",
      met: /\d/.test(password), // ✅ \d en vez de [0-9]
    },
    {
      id: "match",
      label: "Passwords match",
      met:
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword,
    },
  ]
}
