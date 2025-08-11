// Importa un manejador de errores de red con capacidades de reintento
import { NetworkErrorHandler } from "../utils/networkUtils"

// Importa tipos de datos y una excepción específica para validaciones
import { type LoginRequest, type LoginResponse, type User, ValidationException } from "../types/authTypes"

// Importa una función que valida los datos de inicio de sesión antes de enviarlos al backend
import { validateLoginData } from "../utils/validationUtils"

class AuthService {
  // URL base del backend para las operaciones de autenticación
  private baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`

  // Construye las cabeceras HTTP necesarias para llamadas autenticadas
  private getAuthHeaders() {
    const token = localStorage.getItem("authToken") // Recupera el token guardado
    return {
      "Content-Type": "application/json",           // Se envía y recibe JSON
      Authorization: `Bearer ${token}`,             // Token JWT en el encabezado Authorization
    }
  }

  // Método auxiliar para hacer peticiones HTTP con reintentos automáticos y manejo de errores
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    return NetworkErrorHandler.withRetry(async () => {
      const response = await fetch(url, options)

      // Si la respuesta no es correcta, lanza un error con información detallada
      if (!response.ok) {
        const error = new Error() as any
        error.statusCode = response.status

        try {
          // Intenta extraer el mensaje de error desde el cuerpo de la respuesta
          const data = await response.json()
          error.message = data.message || `Error ${response.status}`
        } catch {
          // Si no se puede leer JSON, usa un mensaje genérico
          error.message = `Error ${response.status}: ${response.statusText}`
        }

        throw error
      }

      return response // Si todo va bien, devuelve la respuesta
    })
  }

  // Inicia sesión con las credenciales del usuario
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Valida los datos antes de enviarlos
    const validationErrors = validateLoginData(credentials)
    if (validationErrors.length > 0) {
      throw new ValidationException(validationErrors) // Lanza error si hay problemas de validación
    }

    try {
      // Llama al endpoint de login usando POST
      const response = await this.fetchWithRetry(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials), // Envía usuario y contraseña
      })

      const data: LoginResponse = await response.json()

      // Si el backend devuelve un token, lo guarda en localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        if (data.user) {
          localStorage.setItem("userName", data.user.nombre)
          localStorage.setItem("userEmail", data.user.email)
        }
      }

      return data // Devuelve la respuesta del backend
    } catch (error) {
      // Si el error es de validación, lo vuelve a lanzar tal cual
      if (error instanceof ValidationException) {
        throw error
      }
      // Para otros errores, los mejora con información adicional
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Obtiene la información del usuario autenticado desde el backend
  async getUserInfo(): Promise<User> {
    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/me`, {
        method: "GET",
        headers: this.getAuthHeaders(), // Usa el token guardado para autenticarse
      })

      const data = await response.json()
      return data.user
    } catch (error) {
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Obtiene el nombre del usuario desde localStorage
  getUserName(): string {
    return localStorage.getItem("userName") || "Usuario"
  }

  // Obtiene el email del usuario desde localStorage
  getUserEmail(): string {
    return localStorage.getItem("userEmail") || ""
  }

  // Devuelve el token almacenado
  getToken(): string | null {
    return localStorage.getItem("authToken")
  }

  // Verifica si el usuario está autenticado (tiene token guardado)
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Cierra sesión eliminando toda la información guardada
  logout(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
  }
}

// Crea y exporta una instancia lista para usar del servicio
export const authService = new AuthService()

// Reexporta la excepción para validaciones y el tipo de error de validación
export { ValidationException } from "../types/authTypes"
export type { ValidationError } from "../types/authTypes"
