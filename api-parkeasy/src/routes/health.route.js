import express from "express";
import { checkDBConnection } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/health", checkDBConnection);

export default router;
