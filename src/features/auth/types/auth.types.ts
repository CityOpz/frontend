
export interface LoginFormState {
  username: string
  password: string
}

export interface AuthTokens {
  access: string
  refresh: string
  user?: UserInfo
}

export interface RegisterPayload {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
}

export interface RegisterResponse {
  id?: number
  username: string
  email: string
  first_name: string
  last_name: string
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

export interface UserInfo {
  id: number
  role: "CITIZEN" | "ADMIN"
  first_name: string
  last_name: string
  email: string
}
