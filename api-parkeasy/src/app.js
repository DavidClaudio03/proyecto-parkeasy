import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import healthRoutes from './routes/health.route.js';
import authRoutes from './routes/auth.route.js';
import parqueaderoRoutes from './routes/parqueadero.route.js';
import lugarRoutes from './routes/lugar.route.js';

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar morgan para registrar las solicitudes HTTP
app.use(morgan('dev'));
app.use(express.json());

// Rutas de salud y autenticación
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

// Rutas de parqueaderos
app.use('/api/parqueaderos', parqueaderoRoutes);
app.use('/api/lugares', lugarRoutes);


export default app;
