"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react" // Importar useMemo
import {
  parqueaderoService,
  ValidationException,
  type ValidationError,
  type Parqueadero,
  type UpdateParqueaderoRequest,
  type Lugar,
} from "../services/parqueaderoService"

interface ParqueaderoFormProps {
  parqueadero?: Parqueadero | null
  onSuccess: () => void
  onCancel: () => void
}

// Función de ordenamiento natural para cadenas como "A1", "A10", "A2"
const naturalSortLugares = (a: Lugar, b: Lugar): number => {
  const regex = /(\d+)/g // Captura secuencias de dígitos
  const aParts = a.numero.split(regex).filter(Boolean)
  const bParts = b.numero.split(regex).filter(Boolean)

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    const aPart = aParts[i]
    const bPart = bParts[i]

    const isANum = !isNaN(Number(aPart))
    const isBNum = !isNaN(Number(bPart))

    if (isANum && isBNum) {
      // Si ambos son números, comparar numéricamente
      const numA = Number(aPart)
      const numB = Number(bPart)
      if (numA !== numB) {
        return numA - numB
      }
    } else if (aPart !== bPart) {
      // Si son cadenas o una es número y la otra no, comparar alfabéticamente
      return aPart.localeCompare(bPart)
    }
  }
  // Si una cadena es prefijo de la otra (ej. "A" vs "A1"), la más corta va primero
  return aParts.length - bParts.length
}

const ParqueaderoForm: React.FC<ParqueaderoFormProps> = ({ parqueadero, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState("")
  const [latitud, setLatitud] = useState("")
  const [longitud, setLongitud] = useState("")
  const [capacidad, setCapacidad] = useState("")
  const [direccion, setDireccion] = useState("")
  const [estado, setEstado] = useState<"activo" | "inactivo">("activo")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [serverMessage, setServerMessage] = useState("")

  const [lugares, setLugares] = useState<Lugar[]>([])
  const [loadingLugares, setLoadingLugares] = useState(false)
  const [updatingLugarId, setUpdatingLugarId] = useState<string | null>(null)

  const isEditing = !!parqueadero

  // Ordenar los lugares usando useMemo para evitar re-ordenamientos innecesarios
  const sortedLugares = useMemo(() => {
    return [...lugares].sort(naturalSortLugares)
  }, [lugares])

  useEffect(() => {
    if (parqueadero) {
      setNombre(parqueadero.nombre)
      setLatitud(parqueadero.latitud.toString())
      setLongitud(parqueadero.longitud.toString())
      setCapacidad(parqueadero.capacidad.toString())
      setDireccion(parqueadero.direccion)
      setEstado(parqueadero.estado || "activo")

      const fetchLugares = async () => {
        setLoadingLugares(true)
        try {
          const fetchedLugares = await parqueaderoService.listLugaresByParqueadero(parqueadero.id)
          console.log("📦 Lugares obtenidos del backend:", fetchedLugares)
          setLugares(fetchedLugares)
        } catch (error) {
          console.error("Error al cargar los lugares:", error)
          setServerMessage("Error al cargar los lugares del parqueadero.")
        } finally {
          setLoadingLugares(false)
        }
      }
      fetchLugares()
    } else {
      setNombre("")
      setLatitud("")
      setLongitud("")
      setCapacidad("")
      setDireccion("")
      setEstado("activo")
      setLugares([])
    }
  }, [parqueadero])

  const getFieldError = (fieldName: string): string => {
    const error = errors.find((err) => err.field === fieldName)
    return error ? error.message : ""
  }

  const clearErrors = () => {
    setErrors([])
    setServerMessage("")
  }

  const handleCapacidadChange = (newCapacidad: string) => {
    setCapacidad(newCapacidad)
    clearErrors()
  }

  const handleLugarClick = async (lugar: Lugar) => {
    if (updatingLugarId === lugar.id) return

    setUpdatingLugarId(lugar.id)
    try {
      const newOcupadoState = !lugar.ocupado
      await parqueaderoService.updateLugar(lugar.id, newOcupadoState)

      setLugares((prevLugares) => prevLugares.map((l) => (l.id === lugar.id ? { ...l, ocupado: newOcupadoState } : l)))
      setServerMessage(`Lugar ${lugar.numero} actualizado a ${newOcupadoState ? "ocupado" : "disponible"}.`)
    } catch (error) {
      console.error("Error al actualizar el lugar:", error)
      setServerMessage(error instanceof Error ? error.message : "Error al actualizar el lugar.")
    } finally {
      setUpdatingLugarId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    clearErrors()

    try {
      const parqueaderoData = {
        nombre,
        latitud: Number.parseFloat(latitud),
        longitud: Number.parseFloat(longitud),
        capacidad: Number.parseInt(capacidad),
        direccion,
      }

      if (isEditing && parqueadero) {
        const updateData: UpdateParqueaderoRequest = {
          ...parqueaderoData,
          estado,
        }
        await parqueaderoService.updateParqueadero(parqueadero.id, updateData)
        setServerMessage("Parqueadero actualizado correctamente")
      } else {
        await parqueaderoService.createParqueadero(parqueaderoData)
        setServerMessage("Parqueadero creado correctamente")
      }

      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (error) {
      if (error instanceof ValidationException) {
        setErrors(error.errors)
      } else if (error instanceof Error) {
        setServerMessage(error.message)
      } else {
        setServerMessage("Error inesperado. Inténtalo de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Columna izquierda - Formulario de parqueadero */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Formulario de parqueadero</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className={`form-input-web ${getFieldError("nombre") ? "error" : ""}`}
              placeholder="Ingrese el nombre del parqueadero."
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              required
            />
            {getFieldError("nombre") && <div className="error-message">{getFieldError("nombre")}</div>}
          </div>

          <div>
            <input
              type="text"
              className={`form-input-web ${getFieldError("direccion") ? "error" : ""}`}
              placeholder="Ingrese las calles"
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              required
            />
            {getFieldError("direccion") && <div className="error-message">{getFieldError("direccion")}</div>}
          </div>

          <div>
            <input
              type="number"
              step="any"
              className={`form-input-web ${getFieldError("longitud") ? "error" : ""}`}
              placeholder="Ingrese la coordenada longitud"
              value={longitud}
              onChange={(e) => {
                setLongitud(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              min="-180"
              max="180"
              required
            />
            {getFieldError("longitud") && <div className="error-message">{getFieldError("longitud")}</div>}
          </div>

          <div>
            <input
              type="number"
              step="any"
              className={`form-input-web ${getFieldError("latitud") ? "error" : ""}`}
              placeholder="Ingrese la coordenada latitud"
              value={latitud}
              onChange={(e) => {
                setLatitud(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              min="-90"
              max="90"
              required
            />
            {getFieldError("latitud") && <div className="error-message">{getFieldError("latitud")}</div>}
          </div>

          <div>
            <input
              type="number"
              className={`form-input-web ${getFieldError("capacidad") ? "error" : ""}`}
              placeholder="Ingrese la capacidad"
              value={capacidad}
              onChange={(e) => {
                handleCapacidadChange(e.target.value)
                clearErrors()
              }}
              disabled={isLoading}
              min="1"
              max="1000"
              required
            />
            {getFieldError("capacidad") && <div className="error-message">{getFieldError("capacidad")}</div>}
          </div>

          {isEditing && (
            <div>
              <select
                className="form-input-web"
                value={estado}
                onChange={(e) => setEstado(e.target.value as "activo" | "inactivo")}
                disabled={isLoading}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold transition-colors w-full"
            disabled={isLoading}
          >
            {isLoading ? (isEditing ? "Actualizando..." : "Creando...") : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded font-semibold transition-colors w-full"
            disabled={isLoading}
          >
            Cancelar
          </button>
        </form>

        {/* Mensaje del servidor */}
        {serverMessage && (
          <div className={`server-message ${serverMessage.includes("correctamente") ? "success" : "error"}`}>
            {serverMessage}
          </div>
        )}
      </div>

      {/* Columna derecha - Lugares del parqueadero */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Lugares del parqueadero</h2>

        {isEditing ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Cuadrícula de disponibilidad de lugares
            </h3>

            {loadingLugares ? (
              <div className="text-center text-gray-500 py-8">Cargando lugares...</div>
            ) : sortedLugares.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {sortedLugares.map((lugar) => (
                  <button
                    key={lugar.id}
                    onClick={() => handleLugarClick(lugar)}
                    disabled={updatingLugarId === lugar.id}
                    className={`
                      relative flex items-center justify-center p-2 text-center text-sm font-medium rounded-md transition-colors duration-200
                      aspect-square w-full
                      ${lugar.ocupado ? "bg-orange-400 text-white" : "bg-green-500 text-white"}
                      ${updatingLugarId === lugar.id ? "opacity-70 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}
                    `}
                    aria-label={`Lugar ${lugar.numero} está ${lugar.ocupado ? "ocupado" : "disponible"}. Clic para cambiar.`}
                  >
                    {lugar.numero}
                    {updatingLugarId === lugar.id && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
                        ...
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No hay lugares definidos para este parqueadero.</p>
                <p className="text-sm">Asegúrate de que la capacidad sea mayor a 0 y el parqueadero esté creado.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600 py-8">
            <p>La gestión visual de lugares estará disponible una vez que el parqueadero haya sido creado.</p>
            <p className="text-sm">Puedes definir la capacidad en el formulario de la izquierda.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParqueaderoForm
