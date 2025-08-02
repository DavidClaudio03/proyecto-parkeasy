// Tipos para las respuestas de la API
export interface RegisterRequest {
  nombre: string
  email: string
  contraseña: string
}

export interface LoginRequest {
  email: string
  contraseña: string
}

export interface AuthResponse {
  message: string
  token?: string
  data?: any
}

export interface UserInfo {
  id: string
  nombre: string
  email: string
}

export interface ValidationError {
  field: string
  message: string
}

// Clase para manejar errores de validación
export class ValidationException extends Error {
  public errors: ValidationError[]

  constructor(errors: ValidationError[]) {
    super("Validation failed")
    this.errors = errors
    this.name = "ValidationException"
  }
}

// Función para validar campos de registro
export const validateRegisterData = (data: RegisterRequest): ValidationError[] => {
  const errors: ValidationError[] = []

  // Validar nombre
  if (!data.nombre || data.nombre.trim() === "") {
    errors.push({ field: "nombre", message: "El nombre es requerido" })
  } else if (data.nombre.trim().length < 2) {
    errors.push({ field: "nombre", message: "El nombre debe tener al menos 2 caracteres" })
  }

  // Validar email
  if (!data.email || data.email.trim() === "") {
    errors.push({ field: "email", message: "El email es requerido" })
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.push({ field: "email", message: "El email no tiene un formato válido" })
    }
  }

  // Validar contraseña
  if (!data.contraseña || data.contraseña.trim() === "") {
    errors.push({ field: "contraseña", message: "La contraseña es requerida" })
  } else if (data.contraseña.length < 6) {
    errors.push({ field: "contraseña", message: "La contraseña debe tener al menos 6 caracteres" })
  }

  return errors
}

// Función para validar campos de login
export const validateLoginData = (data: LoginRequest): ValidationError[] => {
  const errors: ValidationError[] = []

  // Validar email
  if (!data.email || data.email.trim() === "") {
    errors.push({ field: "email", message: "El email es requerido" })
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.push({ field: "email", message: "El email no tiene un formato válido" })
    }
  }

  // Validar contraseña
  if (!data.contraseña || data.contraseña.trim() === "") {
    errors.push({ field: "contraseña", message: "La contraseña es requerida" })
  }

  return errors
}

// Servicio de autenticación
class AuthService {
  private baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`

  // Método para registrar usuario
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Validar datos antes de enviar
    const validationErrors = validateRegisterData(userData)
    if (validationErrors.length > 0) {
      throw new ValidationException(validationErrors)
    }

    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: userData.nombre.trim(),
          email: userData.email.trim().toLowerCase(),
          contraseña: userData.contraseña,
        }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error en el registro")
      }

      return data
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }

      if (error instanceof Error) {
        throw new Error(error.message)
      }

      throw new Error("Error de conexión con el servidor")
    }
  }

  // Método para hacer login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Validar datos antes de enviar
    const validationErrors = validateLoginData(credentials)
    if (validationErrors.length > 0) {
      throw new ValidationException(validationErrors)
    }

    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          contraseña: credentials.contraseña,
        }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error en el login")
      }

      // Si el login es exitoso y hay token, guardarlo en localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("isAuthenticated", "true")

        // Guardar información del usuario si está disponible
        if (data.data) {
          localStorage.setItem("userInfo", JSON.stringify(data.data))
        }
      }

      return data
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }

      if (error instanceof Error) {
        throw new Error(error.message)
      }

      throw new Error("Error de conexión con el servidor")
    }
  }

  // Método para obtener información del usuario
  async getUserInfo(): Promise<UserInfo> {
    try {
      // Primero intentar obtener de localStorage
      const storedUserInfo = localStorage.getItem("userInfo")
      if (storedUserInfo) {
        return JSON.parse(storedUserInfo)
      }

      // Si no está en localStorage, hacer petición al servidor
      const token = this.getToken()
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      const response = await fetch(`${this.baseURL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener información del usuario")
      }

      // Guardar en localStorage para futuras consultas
      localStorage.setItem("userInfo", JSON.stringify(data.data))

      return data.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Error de conexión con el servidor")
    }
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userInfo")
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken")
    const isAuth = localStorage.getItem("isAuthenticated")
    return !!(token && isAuth === "true")
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem("authToken")
  }

  // Método para obtener el nombre del usuario desde localStorage
  getUserName(): string {
    try {
      const storedUserInfo = localStorage.getItem("userInfo")
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo)
        return userInfo.nombre || "Usuario"
      }
      return "Usuario"
    } catch {
      return "Usuario"
    }
  }
}

// Exportar instancia única del servicio
export const authService = new AuthService()
