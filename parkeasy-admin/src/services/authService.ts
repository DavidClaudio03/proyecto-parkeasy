import { NetworkErrorHandler } from "../utils/networkUtils"
import { type LoginRequest, type LoginResponse, type User, ValidationException } from "../types/authTypes"
import { validateLoginData } from "../utils/validationUtils"

// DTO de petición para registro
export interface RegisterRequest {
  nombre: string
  email: string
  contraseña: string
}

class AuthService {
  // Base del backend tomada de variables de entorno de Vite.
  // Ej.: VITE_BACKEND_URL="http://localhost:3000"
  private baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`

  // Construye headers con token JWT almacenado en localStorage.
  // Útil para endpoints protegidos (/me).
  private getAuthHeaders() {
    const token = localStorage.getItem("authToken")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // Envoltorio de fetch con reintentos y manejo de errores unificado.
  // Si la respuesta no es OK, intenta parsear JSON de error y lanza una excepción enriquecida.
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    return NetworkErrorHandler.withRetry(async () => {
      const response = await fetch(url, options)

      if (!response.ok) {
        const error = new Error() as any
        error.statusCode = response.status

        try {
          const data = await response.json()
          error.message = data.message || `Error ${response.status}`
        } catch {
          error.message = `Error ${response.status}: ${response.statusText}`
        }

        // Importante: lanzar para que el caller (login/register/...) maneje el error.
        throw error
      }

      return response
    })
  }

  // LOGIN: valida datos, hace POST, guarda token y datos mínimos de usuario.
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Validar datos en el cliente antes de llamar al backend.
    const validationErrors = validateLoginData(credentials)
    if (validationErrors.length > 0) {
      // Se usa una excepción de validación propia para manejar errores de formulario.
      throw new ValidationException(validationErrors)
    }

    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Nota: aquí NO se envía Authorization; es login.
        },
        body: JSON.stringify(credentials),
      })

      const data: LoginResponse = await response.json()

      // Persistencia del token y datos básicos del usuario para sesiones posteriores.
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        if (data.user) {
          localStorage.setItem("userName", data.user.nombre)
          localStorage.setItem("userEmail", data.user.email)
        }
      }

      return data
    } catch (error) {
      // Propagar ValidationException tal cual, y estandarizar otros errores de red.
      if (error instanceof ValidationException) {
        throw error
      }
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // REGISTER: similar a login, pero contra /register.
  // Si el backend devuelve token tras registrar, se inicia sesión automáticamente.
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data: LoginResponse = await response.json()

      // Autologin opcional según respuesta del backend.
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        if (data.user) {
          localStorage.setItem("userName", data.user.nombre)
          localStorage.setItem("userEmail", data.user.email)
        }
      }

      return data
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Obtiene información del usuario autenticado desde /me.
  // Requiere enviar Authorization: Bearer <token>.
  async getUserInfo(): Promise<User> {
    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/me`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })

      const data = await response.json()
      return data.user
    } catch (error) {
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Helpers para mostrar nombre/email en la UI sin ir al backend.
  getUserName(): string {
    return localStorage.getItem("userName") || "Usuario"
  }

  getUserEmail(): string {
    return localStorage.getItem("userEmail") || ""
  }

  // Obtiene el token actual (si existe) desde localStorage.
  getToken(): string | null {
    return localStorage.getItem("authToken")
  }

  // Comprobación rápida de sesión basada en presencia de token (no valida expiración).
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Limpia completamente la sesión local.
  logout(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
  }
}

// Export de una instancia singleton para usar en la app.
export const authService = new AuthService()

// Reexport de tipos/errores para uso externo.
export { ValidationException } from "../types/authTypes"
export type { ValidationError } from "../types/authTypes"
