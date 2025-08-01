import express from 'express';
import authenticateToken from '../utils/auth.js';
import * as parqueaderoController from '../controllers/parqueadero.controller.js';

const router = express.Router();

// Rutas de parqueaderos
router.post('/', authenticateToken, parqueaderoController.createParqueadero);
router.get('/mis-parqueaderos', authenticateToken, parqueaderoController.getMyParqueaderos);
router.put('/:id', authenticateToken, parqueaderoController.updateParqueadero);
router.delete('/:id', authenticateToken, parqueaderoController.deleteParqueadero);
router.get('/disponibilidad-general', parqueaderoController.getDisponibilidadGeneral);




export default router;