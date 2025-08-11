import { NetworkErrorHandler } from "../utils/networkUtils"
import { type LoginRequest, type LoginResponse, type User, ValidationException } from "../types/authTypes"
import { validateLoginData } from "../utils/validationUtils"

class AuthService {
  private baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`

  private getAuthHeaders() {
    const token = localStorage.getItem("authToken")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

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

        throw error
      }

      return response
    })
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Validar datos antes de enviar
    const validationErrors = validateLoginData(credentials)
    if (validationErrors.length > 0) {
      throw new ValidationException(validationErrors)
    }

    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data: LoginResponse = await response.json()

      // Guardar token y datos del usuario
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

  getUserName(): string {
    return localStorage.getItem("userName") || "Usuario"
  }

  getUserEmail(): string {
    return localStorage.getItem("userEmail") || ""
  }

  getToken(): string | null {
    return localStorage.getItem("authToken")
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  logout(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
  }
}

export const authService = new AuthService()
export { ValidationException } from "../types/authTypes"
export type { ValidationError } from "../types/authTypes"
