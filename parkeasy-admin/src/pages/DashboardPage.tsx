"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import { parqueaderoService, type Parqueadero } from "../services/parqueaderoService"
import logoImage from "../assets/ParkEasyLogo.png"
import ParqueaderoForm from "../components/ParqueaderoForm"
import ParqueaderoList from "../components/ParqueaderoList"

export default function DashboardPage() {
  const navigate = useNavigate()
  const [parqueaderos, setParqueaderos] = useState<Parqueadero[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingParqueadero, setEditingParqueadero] = useState<Parqueadero | null>(null)
  const [error, setError] = useState("")
  const [userName, setUserName] = useState("Usuario") // Estado para el nombre del usuario

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  const loadParqueaderos = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await parqueaderoService.getMyParqueaderos()
      setParqueaderos(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al cargar los parqueaderos")
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar nombre del usuario y parqueaderos al iniciar
  useEffect(() => {
    const loadInitialData = async () => {
      // Cargar nombre del usuario
      try {
        const userInfo = await authService.getUserInfo()
        setUserName(userInfo.nombre)
      } catch (error) {
        console.error("Error al cargar información del usuario:", error)
        setUserName(authService.getUserName()) // Fallback a nombre de localStorage
      }
      // Cargar parqueaderos
      loadParqueaderos()
    }
    loadInitialData()
  }, [])

  const handleCreateNew = () => {
    setEditingParqueadero(null)
    setShowForm(true)
  }

  const handleEdit = (parqueadero: Parqueadero) => {
    setEditingParqueadero(parqueadero)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingParqueadero(null)
    loadParqueaderos() // Recargar la lista
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingParqueadero(null)
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <header className="bg-gray-100 border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src={logoImage || "/placeholder.svg"} alt="ParkEasy Logo" className="w-10 h-10 rounded-lg" />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

          {showForm ? (
            <ParqueaderoForm
              parqueadero={editingParqueadero}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          ) : (
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Mis Parqueaderos</h2>
                  <p className="text-gray-600">Gestiona tus espacios de estacionamiento</p>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nuevo Parqueadero</span>
                </button>
              </div>

              {/* Parqueaderos List */}
              <ParqueaderoList parqueaderos={parqueaderos} onEdit={handleEdit} onRefresh={loadParqueaderos} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
