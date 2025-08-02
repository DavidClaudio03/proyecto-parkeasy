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
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner"></div>
          <p className="dashboard-loading-text">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Enhanced Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="flex justify-between items-center">
              <div className="dashboard-logo-container">
                <img src={logoImage || "/placeholder.svg"} alt="ParkEasy Logo" className="dashboard-logo" />
                <div className="dashboard-brand">
                  <h1 className="dashboard-brand-title">ParkEasy</h1>
                  <p className="dashboard-brand-subtitle">Gestión de Parqueaderos</p>
                </div>
              </div>

              <div className="dashboard-user-section">
                <div className="dashboard-user-info">
                  <p className="dashboard-user-greeting">Bienvenido,</p>
                  <p className="dashboard-user-name">{userName}</p>
                </div>
                <button onClick={handleLogout} className="dashboard-logout-btn">
                  <svg className="dashboard-logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-content-wrapper">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 mx-6 mt-6">
                {error}
              </div>
            )}

            {showForm ? (
              <div className="p-6">
                <ParqueaderoForm
                  parqueadero={editingParqueadero}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>
            ) : (
              <>
                {/* Enhanced Actions Bar */}
                <div className="dashboard-actions-bar">
                  <div className="dashboard-actions-content">
                    <div className="dashboard-title-section">
                      <h2>Mis Parqueaderos</h2>
                      <p>Gestiona tus espacios de estacionamiento de manera eficiente</p>
                    </div>
                    <button onClick={handleCreateNew} className="dashboard-new-btn">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Nuevo Parqueadero
                    </button>
                  </div>
                </div>

                {/* Parqueaderos List */}
                <div className="p-6">
                  <ParqueaderoList parqueaderos={parqueaderos} onEdit={handleEdit} onRefresh={loadParqueaderos} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
