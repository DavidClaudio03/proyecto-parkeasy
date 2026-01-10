// Network utilities for handling connectivity and server errors
export interface NetworkError extends Error {
  isNetworkError: boolean
  isServerDown: boolean
  statusCode?: number
}

export class NetworkErrorHandler {
  private static retryAttempts = 3
  private static retryDelay = 1000 // 1 second

  static async withRetry<T>(operation: () => Promise<T>, maxRetries: number = this.retryAttempts): Promise<T> {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error

        // Don't retry validation errors or client errors (4xx)
        if (this.isClientError(error)) {
          throw error
        }

        // If it's the last attempt, throw the error
        if (attempt === maxRetries) {
          throw this.enhanceError(error)
        }

        // Wait before retrying
        await this.delay(this.retryDelay * attempt)
      }
    }

    throw this.enhanceError(lastError!)
  }

  static isNetworkError(error: any): boolean {
    return (
      error instanceof TypeError ||
      error.message?.includes("fetch") ||
      error.message?.includes("network") ||
      error.message?.includes("conexión") ||
      !navigator.onLine
    )
  }

  static isServerError(error: any): boolean {
    return error.statusCode >= 500 || error.message?.includes("servidor")
  }

  static isClientError(error: any): boolean {
    return error.statusCode >= 400 && error.statusCode < 500
  }

  static enhanceError(error: any): NetworkError {
    const networkError = error as NetworkError
    networkError.isNetworkError = this.isNetworkError(error)
    networkError.isServerDown = this.isServerError(error) || this.isNetworkError(error)

    if (this.isNetworkError(error)) {
      networkError.message = "No se pudo conectar con el servidor. Verifica tu conexión a internet."
    } else if (this.isServerError(error)) {
      networkError.message = "El servidor está experimentando problemas. Inténtalo más tarde."
    }

    return networkError
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static async checkConnectivity(): Promise<boolean> {
    if (!navigator.onLine) {
      return false
    }

    try {
      const response = await fetch("/favicon.ico", {
        method: "HEAD",
        cache: "no-cache",
      })
      return response.ok
    } catch {
      return false
    }
  }
}
