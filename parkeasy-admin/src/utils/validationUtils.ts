import type { ValidationError } from "../types/authTypes"
import type { LoginRequest } from "../types/authTypes"

export const validateLoginData = (data: LoginRequest): ValidationError[] => {
  const errors: ValidationError[] = []

  // Validar email
  if (!data.email || data.email.trim() === "") {
    errors.push({ field: "email", message: "El email es requerido" })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: "email", message: "El email no tiene un formato válido" })
  }

  // Validar contraseña
  if (!data.contraseña || data.contraseña.trim() === "") {
    errors.push({ field: "contraseña", message: "La contraseña es requerida" })
  } else if (data.contraseña.length < 6) {
    errors.push({ field: "contraseña", message: "La contraseña debe tener al menos 6 caracteres" })
  }

  return errors
}
