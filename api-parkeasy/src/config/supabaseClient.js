import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Configuración del cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar que las variables de entorno estén definidas
export const supabase = createClient(supabaseUrl, supabaseKey);
