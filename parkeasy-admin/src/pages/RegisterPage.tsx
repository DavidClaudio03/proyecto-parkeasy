"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import logoImage from "../assets/ParkEasyLogo.png" 

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register attempt:", { name, email, password })
    // Aquí implementarías la lógica de registro
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
              className="form-input-web"
              placeholder="Ingrese su nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Registrar
          </button>
        </form>

        <div className="auth-link-web">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  )
}
