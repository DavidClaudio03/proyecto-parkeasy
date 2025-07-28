import { supabase } from "../config/supabaseClient.js";

export const checkDBConnection = async (req, res) => {
  const { data, error } = await supabase.from("usuarios").select("id").limit(1);

  if (error) {
    return res
      .status(500)
      .json({ message: "Error en Supabase", error: error.message });
  }

  res.json({ message: "Conexión exitosa a Supabase", data });
};
