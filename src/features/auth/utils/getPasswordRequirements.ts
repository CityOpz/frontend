export function getPasswordRequirements(
  password: string,
  confirmPassword: string
) {
  return [
    {
      label: "8-12 characters",
      met: password.length >= 8 && password.length <= 12,
    },
    {
      label: "At least 1 uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "At least 1 lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "At least 1 number",
      met: /[0-9]/.test(password),
    },
    {
      label: "Passwords match",
      met:
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword,
    },
  ]
}
