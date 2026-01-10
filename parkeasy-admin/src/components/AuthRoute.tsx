"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { authService } from "../services/authService"

// Props: recibe como children el contenido que debería renderizar
interface AuthRouteProps {
  children: React.ReactNode
}

// Componente funcional que actúa como guardián de rutas
const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated()

  // Si está autenticado, lo redirige al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Si NO está autenticado, renderiza el contenido hijo (children)
  return <>{children}</>
}

export default AuthRoute
