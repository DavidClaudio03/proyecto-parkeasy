import express from 'express';
import authenticateToken from '../utils/auth.js';
import { listLugaresByParqueadero, updateLugar } from '../controllers/lugar.controller.js';

const router = express.Router();

router.get('/:parqueadero_id', authenticateToken, listLugaresByParqueadero); // Lista lugares de un parqueadero
router.put('/:id', authenticateToken, updateLugar); // Actualiza un lugar

export default router;
