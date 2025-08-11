"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { authService } from "../services/authService"

interface AuthRouteProps {
  children: React.ReactNode
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default AuthRoute
