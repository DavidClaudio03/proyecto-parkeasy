export interface LoginRequest {
  email: string
  contraseña: string
}

export interface LoginResponse {
  message: string
  token?: string
  user?: User
}

export interface User {
  id: string
  nombre: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface ValidationError {
  field: string
  message: string
}

export class ValidationException extends Error {
  public errors: ValidationError[]

  constructor(errors: ValidationError[]) {
    super("Validation failed")
    this.errors = errors
    this.name = "ValidationException"
  }
}
