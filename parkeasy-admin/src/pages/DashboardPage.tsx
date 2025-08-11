"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import { parqueaderoService, type Parqueadero } from "../services/parqueaderoService"
import logoImage from "../assets/ParkEasyLogo.png"
import ParqueaderoForm from "../components/ParqueaderoForm"
import ParqueaderoList from "../components/ParqueaderoList"
import ErrorBoundary from "../components/ErrorBoundary"
import OfflineNotice from "../components/OfflineNotice"

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
    } catch (error: any) {
      console.error("Error loading parqueaderos:", error)

      if (error.isNetworkError || error.isServerDown) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.")
      } else {
        setError(error.message || "Error al cargar los parqueaderos")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      // Cargar nombre del usuario
      try {
        const userInfo = await authService.getUserInfo()
        setUserName(userInfo.nombre)
      } catch (error: any) {
        console.error("Error al cargar información del usuario:", error)

        // Fallback to localStorage if server is down
        const fallbackName = authService.getUserName()
        setUserName(fallbackName || "Usuario")

        // Don't show error for user info if we have fallback
        if (!fallbackName && !error.isNetworkError) {
          console.warn("Could not load user info and no fallback available")
        }
      }

      // Cargar parqueaderos
      await loadParqueaderos()
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
      <ErrorBoundary>
        <OfflineNotice />
        <div className="page-container">
          <div className="dashboard-loading">
            <div className="dashboard-loading-spinner"></div>
            <p className="dashboard-loading-text">Cargando dashboard...</p>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <OfflineNotice />
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                    <button
                      onClick={loadParqueaderos}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
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
    </ErrorBoundary>
  )
}
