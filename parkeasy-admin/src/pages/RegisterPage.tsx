"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoImage from "../assets/ParkEasyLogo.png"
import { authService, ValidationException, type ValidationError } from "../services/authService"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    clearErrors()

    try {
      // Primero registrar al usuario
      const registerResponse = await authService.register({
        nombre: name,
        email,
        contraseña: password,
      })

      // Registro exitoso
      setServerMessage("Registro exitoso. Iniciando sesión automáticamente...")
      console.log("Registro exitoso:", registerResponse)

      // Después del registro exitoso, hacer login automáticamente
      try {
        const loginResponse = await authService.login({
          email,
          contraseña: password,
        })

        console.log("Login automático exitoso:", loginResponse)

        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      } catch (loginError) {
        // Si el login automático falla, mostrar mensaje y redirigir al login manual
        setServerMessage("Registro exitoso. Por favor, inicia sesión manualmente.")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        // Errores de validación
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

        <h1 className="auth-title-web">Registro</h1>

        <form onSubmit={handleSubmit} className="auth-form-web">
          <div className="form-group-web">
            <input
              type="text"
              className={`form-input-web ${getFieldError("nombre") ? "error" : ""}`}
              placeholder="Ingrese su nombre"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
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

          <button type="submit" className="auth-button-web" disabled={isLoading}>
            {isLoading ? "Registrando e iniciando sesión..." : "Registrar"}
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
