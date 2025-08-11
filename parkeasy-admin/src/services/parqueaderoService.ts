// Tipos para los parqueaderos
export interface Parqueadero {
  id: string
  nombre: string
  latitud: number
  longitud: number
  capacidad: number
  direccion: string
  estado?: "activo" | "inactivo"
  createdAt?: string
  updatedAt?: string
}

// Nuevo tipo para los lugares de parqueo
export interface Lugar {
  id: string
  parqueadero_id: string
  numero: string // Ej: P1, P2, etc.
  ocupado: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateParqueaderoRequest {
  nombre: string
  latitud: number
  longitud: number
  capacidad: number
  direccion: string
}

export interface UpdateParqueaderoRequest {
  nombre: string
  latitud: number
  longitud: number
  capacidad: number
  direccion: string
  estado: "activo" | "inactivo"
}

export interface ParqueaderoResponse {
  message: string
  data?: Parqueadero | Parqueadero[] | Lugar[] // Añadir Lugar[] para respuestas de lugares
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

// Función para validar datos de parqueadero
export const validateParqueaderoData = (
  data: CreateParqueaderoRequest | UpdateParqueaderoRequest,
): ValidationError[] => {
  const errors: ValidationError[] = []

  // Validar nombre
  if (!data.nombre || data.nombre.trim() === "") {
    errors.push({ field: "nombre", message: "El nombre es requerido" })
  } else if (data.nombre.trim().length < 3) {
    errors.push({ field: "nombre", message: "El nombre debe tener al menos 3 caracteres" })
  }

  // Validar latitud
  if (data.latitud === undefined || data.latitud === null) {
    errors.push({ field: "latitud", message: "La latitud es requerida" })
  } else if (data.latitud < -90 || data.latitud > 90) {
    errors.push({ field: "latitud", message: "La latitud debe estar entre -90 y 90" })
  }

  // Validar longitud
  if (data.longitud === undefined || data.longitud === null) {
    errors.push({ field: "longitud", message: "La longitud es requerida" })
  } else if (data.longitud < -180 || data.longitud > 180) {
    errors.push({ field: "longitud", message: "La longitud debe estar entre -180 y 180" })
  }

  // Validar capacidad
  if (!data.capacidad || data.capacidad <= 0) {
    errors.push({ field: "capacidad", message: "La capacidad debe ser mayor a 0" })
  } else if (data.capacidad > 1000) {
    errors.push({ field: "capacidad", message: "La capacidad no puede ser mayor a 1000" })
  }

  // Validar dirección
  if (!data.direccion || data.direccion.trim() === "") {
    errors.push({ field: "direccion", message: "La dirección es requerida" })
  } else if (data.direccion.trim().length < 5) {
    errors.push({ field: "direccion", message: "La dirección debe tener al menos 5 caracteres" })
  }

  return errors
}

// Importar NetworkErrorHandler
import { NetworkErrorHandler } from "../utils/networkUtils"

// Servicio de parqueaderos
class ParqueaderoService {
  private baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/parqueaderos`
  private lugaresURL = `${import.meta.env.VITE_BACKEND_URL}/api/lugares`

  // Obtener token de autenticación
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

      // Enhance response with status code for error handling
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

  // Crear parqueadero
  async createParqueadero(parqueaderoData: CreateParqueaderoRequest): Promise<ParqueaderoResponse> {
    // Validar datos antes de enviar
    const validationErrors = validateParqueaderoData(parqueaderoData)
    if (validationErrors.length > 0) {
      throw new ValidationException(validationErrors)
    }

    try {
      const response = await this.fetchWithRetry(this.baseURL, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          nombre: parqueaderoData.nombre.trim(),
          latitud: Number(parqueaderoData.latitud),
          longitud: Number(parqueaderoData.longitud),
          capacidad: Number(parqueaderoData.capacidad),
          direccion: parqueaderoData.direccion.trim(),
        }),
      })

      const data: ParqueaderoResponse = await response.json()
      return data
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Listar mis parqueaderos
  async getMyParqueaderos(): Promise<Parqueadero[]> {
    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/mis-parqueaderos`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })

      const data: ParqueaderoResponse = await response.json()
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Actualizar parqueadero
  async updateParqueadero(id: string, parqueaderoData: UpdateParqueaderoRequest): Promise<ParqueaderoResponse> {
    // Validar datos antes de enviar
    const validationErrors = validateParqueaderoData(parqueaderoData)
    if (validationErrors.length > 0) {
      throw new ValidationException(validationErrors)
    }

    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          nombre: parqueaderoData.nombre.trim(),
          latitud: Number(parqueaderoData.latitud),
          longitud: Number(parqueaderoData.longitud),
          capacidad: Number(parqueaderoData.capacidad),
          direccion: parqueaderoData.direccion.trim(),
          estado: parqueaderoData.estado,
        }),
      })

      const data: ParqueaderoResponse = await response.json()
      return data
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Eliminar parqueadero
  async deleteParqueadero(id: string): Promise<ParqueaderoResponse> {
    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      const data: ParqueaderoResponse = await response.json()
      return data
    } catch (error) {
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Listar lugares por ID de parqueadero
  async listLugaresByParqueadero(parqueaderoId: string): Promise<Lugar[]> {
    try {
      const response = await this.fetchWithRetry(`${this.lugaresURL}/${parqueaderoId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })

      const data: ParqueaderoResponse = await response.json()
      console.log("Lugares obtenidos", data)
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Actualizar estado de un lugar
  async updateLugar(lugarId: string, ocupado: boolean): Promise<ParqueaderoResponse> {
    try {
      const response = await this.fetchWithRetry(`${this.lugaresURL}/${lugarId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ocupado }),
      })

      const data: ParqueaderoResponse = await response.json()
      return data
    } catch (error) {
      throw NetworkErrorHandler.enhanceError(error)
    }
  }

  // Update parqueadero capacity and regenerate parking spots
  async updateParqueaderoCapacity(id: string, parqueaderoData: UpdateParqueaderoRequest): Promise<ParqueaderoResponse> {
    // First update the parqueadero
    const result = await this.updateParqueadero(id, parqueaderoData)

    // Then refresh the parking spots to match the new capacity
    try {
      const response = await this.fetchWithRetry(`${this.baseURL}/${id}/regenerate-lugares`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ capacidad: parqueaderoData.capacidad }),
      })

      if (!response.ok) {
        console.warn("Warning: Could not regenerate parking spots, but parqueadero was updated")
      }
    } catch (error) {
      console.warn("Warning: Error regenerating parking spots:", error)
    }

    return result
  }
}

// Exportar instancia única del servicio
export const parqueaderoService = new ParqueaderoService()
