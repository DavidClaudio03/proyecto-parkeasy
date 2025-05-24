// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import parqueaderosRoutes from "./routes/parqueaderos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/parqueaderos", parqueaderosRoutes);

app.get("/", (req, res) => {
  res.send("ParkEasy Backend API 🚗");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
