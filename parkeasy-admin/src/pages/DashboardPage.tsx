"use client"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import logoImage from "../assets/ParkEasyLogo.png"

export default function DashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  // Puedes obtener información del usuario del token si lo decodificas,
  // por ahora solo mostraremos un mensaje genérico.
  const userEmail = authService.getToken() ? "usuario" : "invitado" // Esto es un placeholder, idealmente decodificarías el token

  return (
    <div className="page-container">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-7xl w-full text-center">
            <div className="logo-container mb-6">
            <img src={logoImage || "/placeholder.svg"} alt="ParkEasy Logo" className="logo-web mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenido al Dashboard, {userEmail}!</h1>
            <p className="text-gray-600 mb-8">Aquí podrás gestionar tus parqueaderos y ver la información relevante.</p>
            <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
            Cerrar Sesión
            </button>
        </div>
        </div>
    </div>
  )
}
