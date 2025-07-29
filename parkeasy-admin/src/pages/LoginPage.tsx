"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import logoImage from "../assets/ParkEasyLogo.png" // Ajusta la extensión según tu archivo (.png, .svg, .jpg, etc.)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
    // Aquí implementarías la lógica de autenticación
  }

  return (
    <div className="page-container">
      <div className="auth-container-web">
        <div className="logo-container">
          <img src={logoImage || "/placeholder.svg"} alt="ParkEasy Logo" className="logo-web" />
        </div>

        <h1 className="auth-title-web">Inicio de sesión</h1>

        <form onSubmit={handleSubmit} className="auth-form-web">
          <div className="form-group-web">
            <input
              type="email"
              className="form-input-web"
              placeholder="Ingrese su email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group-web">
            <input
              type="password"
              className="form-input-web"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button-web">
            Iniciar sesión
          </button>
        </form>

        <div className="auth-link-web">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  )
}
