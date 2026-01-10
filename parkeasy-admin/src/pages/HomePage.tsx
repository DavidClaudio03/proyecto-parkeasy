import { Link } from "react-router-dom"
import logoImage from "../assets/ParkEasyLogo.png" // Logo principal

// ====== Componentes de íconos SVG reutilizables ======
// (Se usan en distintas secciones para mejorar la UI visual)
const CarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
    />
  </svg>
)

const MapPinIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const SmartphoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"
    />
  </svg>
)

const MonitorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

// ====== Componente principal de la página ======
export default function HomePage() {
  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src={logoImage || "/placeholder.svg"} alt="ParkEasy Logo" className="w-10 h-10 rounded-lg" />
              <h1 className="text-2xl font-bold text-gray-900">ParkEasy</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Características
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                Cómo Funciona
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPinIcon />
              <span>Universidad de las Fuerzas Armadas ESPE - Latacunga</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Encuentra tu
              <span className="text-blue-600"> parqueadero ideal</span>
              <br />
              en tiempo real
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              ParkEasy conecta a conductores con parqueaderos disponibles cerca del campus universitario. Ahorra tiempo,
              reduce el estrés y encuentra tu espacio perfecto al instante.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard" className="btn btn-primary">
              {" "}
              {/* Cambiado a /dashboard */}
              <MonitorIcon />
              <span>Panel Administrativo</span>
            </Link>
            <button className="btn btn-success">
              <SmartphoneIcon />
              <span>Descargar App Móvil</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir ParkEasy?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Diseñado específicamente para la comunidad universitaria de ESPE Latacunga
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tiempo Real</h3>
              <p className="text-gray-600">Información actualizada al instante sobre disponibilidad de espacios</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rutas Optimizadas</h3>
              <p className="text-gray-600">Navegación directa desde tu ubicación hasta el parqueadero seleccionado</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguro y Confiable</h3>
              <p className="text-gray-600">Sistema seguro con autenticación y gestión individual de parqueaderos</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
            <p className="text-xl text-gray-600">Simple, rápido y eficiente</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Drivers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <SmartphoneIcon />
                <h3 className="text-2xl font-bold text-gray-900 ml-3">Para Conductores</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-gray-600">Abre la app móvil y permite el acceso a tu ubicación</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-gray-600">Ve la lista de parqueaderos ordenados por disponibilidad</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-gray-600">Selecciona "Ir a la ruta" y sigue las indicaciones</p>
                </div>
              </div>
            </div>

            {/* For Parking Owners */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <MonitorIcon />
                <h3 className="text-2xl font-bold text-gray-900 ml-3">Para Dueños</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-gray-600">Regístrate y crea tu cuenta en el panel web</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-gray-600">Registra tu parqueadero con ubicación y capacidad</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-gray-600">Actualiza la disponibilidad en tiempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para optimizar tu experiencia de estacionamiento?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a la comunidad ParkEasy y transforma la manera de encontrar parqueadero
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Registrar mi Parqueadero
            </Link>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-blue-400">
              Descargar App Móvil
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoImage || "/placeholder.svg"} alt="ParkEasy Logo" className="w-8 h-8 rounded-lg" />
                <h3 className="text-xl font-bold">ParkEasy</h3>
              </div>
              <p className="text-gray-400">
                Solución inteligente de gestión de parqueaderos para la comunidad universitaria ESPE Latacunga.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <p>Universidad de las Fuerzas Armadas ESPE</p>
                <p>Sede Latacunga</p>
                <p>Ecuador</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Desarrollado por</h4>
              <div className="space-y-2 text-gray-400">
                <p>Carlos Chasi</p>
                <p>David Claudio</p>
                <p className="text-sm">Versión 0.1 - Mayo 2025</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ParkEasy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
