import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import healthRoutes from './routes/health.route.js';
import authRoutes from './routes/auth.route.js';

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar morgan para registrar las solicitudes HTTP
app.use(morgan('dev')); // 'dev' es un formato predefinido que muestra información concisa

app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

export default app;
