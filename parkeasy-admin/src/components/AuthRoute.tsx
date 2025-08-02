import type React from "react"
import { Navigate } from "react-router-dom"
import { authService } from "../services/authService"

interface AuthRouteProps {
  children: React.ReactNode
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  if (authService.isAuthenticated()) {
    // Si el usuario ya está autenticado, redirige al dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default AuthRoute
