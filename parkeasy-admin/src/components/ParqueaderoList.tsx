"use client"

import type React from "react"
import { useState } from "react"
import { parqueaderoService, type Parqueadero } from "../services/parqueaderoService"

interface ParqueaderoListProps {
  parqueaderos: Parqueadero[]
  onEdit: (parqueadero: Parqueadero) => void
  onRefresh: () => void
}

const ParqueaderoList: React.FC<ParqueaderoListProps> = ({ parqueaderos, onEdit, onRefresh }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el parqueadero "${nombre}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      await parqueaderoService.deleteParqueadero(id)
      onRefresh() // Refrescar la lista después de eliminar
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al eliminar el parqueadero")
    } finally {
      setDeletingId(null)
    }
  }

  if (parqueaderos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes parqueaderos registrados</h3>
        <p className="text-gray-600">Crea tu primer parqueadero para comenzar a gestionar tus espacios.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Mis Parqueaderos ({parqueaderos.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full w-full divide-y divide-gray-200">
          {" "}
          {/* Added w-full */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Capacidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Coordenadas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parqueaderos.map((parqueadero) => (
              <tr key={parqueadero.id} className="hover:bg-gray-100">
                {" "}
                {/* Added hover effect */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{parqueadero.nombre}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900" title={parqueadero.direccion}>
                    {" "}
                    {/* Removed max-w-xs truncate */}
                    {parqueadero.direccion}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{parqueadero.capacidad} espacios</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500">
                    <div>Lat: {parqueadero.latitud}</div>
                    <div>Lng: {parqueadero.longitud}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      parqueadero.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {parqueadero.estado || "activo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(parqueadero)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      disabled={deletingId === parqueadero.id}
                    >
                      Gestionar
                    </button>
                    <button
                      onClick={() => handleDelete(parqueadero.id, parqueadero.nombre)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      disabled={deletingId === parqueadero.id}
                    >
                      {deletingId === parqueadero.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ParqueaderoList
