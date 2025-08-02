"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  parqueaderoService,
  ValidationException,
  type ValidationError,
  type Parqueadero,
  type UpdateParqueaderoRequest,
} from "../services/parqueaderoService"

interface ParqueaderoFormProps {
  parqueadero?: Parqueadero | null
  onSuccess: () => void
  onCancel: () => void
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

  // Estados para la gestión de lugares
  const [numeroLugar, setNumeroLugar] = useState("")
  const [lugares, setLugares] = useState<string[]>([])

  const isEditing = !!parqueadero

  // Cargar datos del parqueadero si estamos editando
  useEffect(() => {
    if (parqueadero) {
      setNombre(parqueadero.nombre)
      setLatitud(parqueadero.latitud.toString())
      setLongitud(parqueadero.longitud.toString())
      setCapacidad(parqueadero.capacidad.toString())
      setDireccion(parqueadero.direccion)
      setEstado(parqueadero.estado || "activo")

      // Generar lugares basados en la capacidad
      const lugaresArray = Array.from({ length: parqueadero.capacidad }, (_, i) => `P${i + 1}`)
      setLugares(lugaresArray)
    }
  }, [parqueadero])

  // Función para obtener error específico de un campo
  const getFieldError = (fieldName: string): string => {
    const error = errors.find((err) => err.field === fieldName)
    return error ? error.message : ""
  }

  // Función para limpiar errores
  const clearErrors = () => {
    setErrors([])
    setServerMessage("")
  }

  // Función para agregar lugar
  const handleAgregarLugar = () => {
    if (numeroLugar.trim() && !lugares.includes(numeroLugar.trim())) {
      setLugares([...lugares, numeroLugar.trim()])
      setNumeroLugar("")
    }
  }

  // Función para actualizar lugares basados en capacidad
  const handleCapacidadChange = (newCapacidad: string) => {
    setCapacidad(newCapacidad)
    const cap = Number.parseInt(newCapacidad)
    if (cap > 0) {
      const lugaresArray = Array.from({ length: cap }, (_, i) => `P${i + 1}`)
      setLugares(lugaresArray)
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
        // Actualizar parqueadero existente
        const updateData: UpdateParqueaderoRequest = {
          ...parqueaderoData,
          estado,
        }
        await parqueaderoService.updateParqueadero(parqueadero.id, updateData)
        setServerMessage("Parqueadero actualizado correctamente")
      } else {
        // Crear nuevo parqueadero
        await parqueaderoService.createParqueadero(parqueaderoData)
        setServerMessage("Parqueadero creado correctamente")
      }

      // Llamar a onSuccess después de un breve delay
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

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="form-input-web flex-1"
              placeholder="Número del lugar (ejemplo P1)"
              value={numeroLugar}
              onChange={(e) => setNumeroLugar(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAgregarLugar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition-colors"
            >
              Actualizar
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Cuadrícula de todos los lugares del parqueadero
            </h3>

            {lugares.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {lugares.map((lugar, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-300 rounded p-2 text-center text-sm font-medium text-gray-700"
                  >
                    {lugar}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No hay lugares definidos</p>
                <p className="text-sm">Ingrese la capacidad para generar los lugares automáticamente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParqueaderoForm
