import { supabase } from "../config/supabaseClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registro
export const registerUser = async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  if (!nombre || !email || !contraseña) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  if (contraseña.length < 6) {
    return res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 6 caracteres." });
  }

  const { data: existingUser } = await supabase
    .from("usuarios")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return res.status(400).json({ message: "El correo ya está en uso." });
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ nombre, email, contraseña: hashedPassword }]);

  if (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar usuario.", error: error.message });
  }

  res.status(201).json({ message: "Usuario registrado correctamente.", data });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos." });
  }

  const { data: user, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: "Credenciales inválidas." });
  }

  const match = await bcrypt.compare(contraseña, user.contraseña);

  if (!match) {
    return res.status(401).json({ message: "Contraseña incorrecta." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, nombre: user.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  res.json({ message: "Login exitoso", token });
};
