import express from "express";
import { obtenerParqueaderos } from "../controllers/parqueaderos.controller.js";

const router = express.Router();

router.get("/", obtenerParqueaderos);

export default router;
