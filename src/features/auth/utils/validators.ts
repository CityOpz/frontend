export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateUsername(username: string): ValidationResult {
  if (!username.trim()) {
    return { valid: false, error: "Username is required" }
  }

  if (username.length < 3 || username.length > 20) {
    return { valid: false, error: "Username must be 3-20 characters" }
  }

  if (/\s/.test(username)) {
    return { valid: false, error: "Username cannot contain spaces" }
  }

  if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
    return { valid: false, error: "Only letters, numbers, _ or . allowed" }
  }

  const reserved = ["admin", "root", "administrator", "system", "moderator"]

  if (reserved.includes(username.toLowerCase())) {
    return { valid: false, error: "This username is not allowed" }
  }

  return { valid: true }
}

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { valid: false, error: "Email is required" }
  }

  if (/\s/.test(email)) {
    return { valid: false, error: "Email cannot contain spaces" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" }
  }

  return { valid: true }
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: "Password is required" }
  }

  if (password.length < 8 || password.length > 12) {
    return { valid: false, error: "Password must be 8-12 characters" }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Must contain at least 1 uppercase letter" }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Must contain at least 1 lowercase letter" }
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: "Must contain at least 1 number" }
  }

  return { valid: true }
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { valid: false, error: "Please confirm your password" }
  }

  if (password !== confirmPassword) {
    return { valid: false, error: "Passwords do not match" }
  }

  return { valid: true }
}

export function validateFirstName(name: string): ValidationResult {
  if (!name.trim()) {
    return { valid: false, error: "First name is required" }
  }

  if (name.length < 2) {
    return { valid: false, error: "First name must be at least 2 characters" }
  }

  return { valid: true }
}

export function validateLastName(name: string): ValidationResult {
  if (!name.trim()) {
    return { valid: false, error: "Last name is required" }
  }

  if (name.length < 2) {
    return { valid: false, error: "Last name must be at least 2 characters" }
  }

  return { valid: true }
}