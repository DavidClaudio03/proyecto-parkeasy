import type React from "react"
import { Navigate } from "react-router-dom"
import { authService } from "../services/authService"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    // Si el usuario no está autenticado, redirige a la página de login
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
