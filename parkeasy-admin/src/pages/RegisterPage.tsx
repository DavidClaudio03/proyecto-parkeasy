"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoImage from "../assets/ParkEasyLogo.png"
import { ValidationException, type ValidationError } from "../services/authService"

interface RegisterRequest {
  nombre: string
  email: string
  contraseña: string
  confirmarContraseña: string
}

export default function RegisterPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [serverMessage, setServerMessage] = useState("")
  const navigate = useNavigate()

  // Función para obtener error específico de un campo
  const getFieldError = (fieldName: string): string => {
    const error = errors.find((err) => err.field === fieldName)
    return error ? error.message : ""
  }

  // Función para limpiar errores
  const clearErrors = () => {
    setErrors([])
    setServerMessage("")
  }

  // Validación local del formulario
  const validateForm = (): ValidationError[] => {
    const validationErrors: ValidationError[] = []

    // Validar nombre
    if (!nombre || nombre.trim() === "") {
      validationErrors.push({ field: "nombre", message: "El nombre es requerido" })
    } else if (nombre.trim().length < 2) {
      validationErrors.push({ field: "nombre", message: "El nombre debe tener al menos 2 caracteres" })
    }

    // Validar email
    if (!email || email.trim() === "") {
      validationErrors.push({ field: "email", message: "El email es requerido" })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push({ field: "email", message: "El email no tiene un formato válido" })
    }

    // Validar contraseña
    if (!password || password.trim() === "") {
      validationErrors.push({ field: "contraseña", message: "La contraseña es requerida" })
    } else if (password.length < 6) {
      validationErrors.push({ field: "contraseña", message: "La contraseña debe tener al menos 6 caracteres" })
    }

    // Validar confirmación de contraseña
    if (!confirmPassword || confirmPassword.trim() === "") {
      validationErrors.push({ field: "confirmarContraseña", message: "Debes confirmar tu contraseña" })
    } else if (password !== confirmPassword) {
      validationErrors.push({ field: "confirmarContraseña", message: "Las contraseñas no coinciden" })
    }

    return validationErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    clearErrors()

    // Validar formulario localmente
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simular registro (ya que no tenemos endpoint de registro en el servicio actual)
      // En una implementación real, esto sería authService.register()
      const registerData: RegisterRequest = {
        nombre: nombre.trim(),
        email: email.trim(),
        contraseña: password,
        confirmarContraseña: confirmPassword,
      }

      // Por ahora, simularemos un registro exitoso
      // En el futuro, esto debería ser reemplazado por una llamada real al backend
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simular delay de red

      setServerMessage("Registro exitoso. Redirigiendo al login...")

      // Redirigir al login después de un breve delay
      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (error) {
      if (error instanceof ValidationException) {
        // Errores de validación del servidor
        setErrors(error.errors)
      } else if (error instanceof Error) {
        // Errores del servidor o de red
        setServerMessage(error.message)
      } else {
        setServerMessage("Error inesperado. Inténtalo de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="auth-container-web">
        <div className="logo-container">
          <img src={logoImage || "/placeholder.svg"} alt="ParkEasy Logo" className="logo-web" />
        </div>

        <h1 className="auth-title-web">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="auth-form-web">
          <div className="form-group-web">
            <input
              type="text"
              className={`form-input-web ${getFieldError("nombre") ? "error" : ""}`}
              placeholder="Ingrese su nombre completo"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              required
            />
            {getFieldError("nombre") && <div className="error-message">{getFieldError("nombre")}</div>}
          </div>

          <div className="form-group-web">
            <input
              type="email"
              className={`form-input-web ${getFieldError("email") ? "error" : ""}`}
              placeholder="Ingrese su email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              required
            />
            {getFieldError("email") && <div className="error-message">{getFieldError("email")}</div>}
          </div>

          <div className="form-group-web">
            <input
              type="password"
              className={`form-input-web ${getFieldError("contraseña") ? "error" : ""}`}
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              required
            />
            {getFieldError("contraseña") && <div className="error-message">{getFieldError("contraseña")}</div>}
          </div>

          <div className="form-group-web">
            <input
              type="password"
              className={`form-input-web ${getFieldError("confirmarContraseña") ? "error" : ""}`}
              placeholder="Confirme su contraseña"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              required
            />
            {getFieldError("confirmarContraseña") && (
              <div className="error-message">{getFieldError("confirmarContraseña")}</div>
            )}
          </div>

          <button type="submit" className="auth-button-web" disabled={isLoading}>
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Mensaje del servidor */}
        {serverMessage && (
          <div className={`server-message ${serverMessage.includes("exitoso") ? "success" : "error"}`}>
            {serverMessage}
          </div>
        )}

        <div className="auth-link-web">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  )
}
