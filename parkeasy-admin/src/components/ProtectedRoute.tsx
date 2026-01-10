"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { authService } from "../services/authService"

// Props: el contenido que debería mostrarse si el usuario está autenticado
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Consulta si hay sesión activa
  const isAuthenticated = authService.isAuthenticated()

  // Si NO hay sesión, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si hay sesión, renderiza el contenido protegido
  return <>{children}</>

  }
export default ProtectedRoute