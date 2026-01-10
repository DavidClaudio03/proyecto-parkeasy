# ParkEasy

Una solución integral para gestión de estacionamientos compuesta por tres componentes:

- **api-parkeasy**: Backend RESTful (p. ej., Node.js/Express o similar).
- **parkeasy-admin**: Panel de administración web para gestión de reservas, usuarios y estadísticas.
- **parkeasy-app**: Aplicación móvil o web para usuarios finales que permite reservar y gestionar estacionamientos.

## Contenido

- `api-parkeasy/` — Backend que expone APIs para autenticación, reservas, pagos y más.
- `parkeasy-admin/` — Panel administrativo con roles, visualización de datos, control de reservas.
- `parkeasy-app/` — Interfaz de usuario para reservar espacios con geolocalización, pagos y notificaciones.

## Tecnologías

- **Backend**: TypeScript, JavaScript, Express (u otro framework), PostgreSQL/MySQL (u otro).
- **Admin**: React o Vue, Bootstrap o Tailwind CSS.
- **App**: React Native, Flutter, Ionic o similar.

## Instalación y uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/DavidClaudio03/proyecto-parkeasy.git
cd proyecto-parkeasy
```

### 2. Configurar entornos
Cada carpeta (`api-parkeasy`, `parkeasy-admin`, `parkeasy-app`) debería incluir su propio `.env.example` con variables como:
```
PORT=…
DATABASE_URL=…
JWT_SECRET=…
API_URL=…
```

### 3. Instalar dependencias y ejecutar

Por ejemplo:
# Backend
cd api-parkeasy
npm install
npm run dev

# Admin
cd ../parkeasy-admin
npm install
node src/index.js

# App
cd ../parkeasy-app
npm install
npx expo start

### 4. Uso
- **Admin**: [http://localhost:3000](http://localhost:3000) — registro de administradores, gestión de reservas.
- **App**: [http://localhost:3001](http://localhost:3001) — registro e inicio de sesión de usuarios, búsqueda y reserva de espacios.

## Características

- Registro e inicio de sesión.
- Visualización del estado de plazas disponibles.
- Reserva de espacio con geolocalización.
- Notificaciones y pago integrado (opcional).
- Dashboard administrativo con métricas y control.
- Soporte para múltiples roles.

## Estructura del proyecto

```text
proyecto-parkeasy/
├── api-parkeasy/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/
├── parkeasy-admin/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── parkeasy-app/
    └── src/
        ├── screens/
        ├── components/
        └── services/
```

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nombre-feature`).
3. Implementa tu mejora y comitea los cambios (`git commit -m "feat: descripción del cambio"`).
4. Empuja a tu fork (`git push origin feature/nombre-feature`).
5. Abre un Pull Request para revisión.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
