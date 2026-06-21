
export interface LoginFormState {
  username: string
  password: string
}

export interface RegisterFormState {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface FormErrors {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}
