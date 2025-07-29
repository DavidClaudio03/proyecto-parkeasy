import express from "express";
import healthRoutes from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

export default app;
