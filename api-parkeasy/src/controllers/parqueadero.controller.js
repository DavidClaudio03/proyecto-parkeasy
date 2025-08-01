import { supabase } from '../config/supabaseClient.js';

/**
 * Crear un nuevo parqueadero asociado al usuario autenticado.
 */
export async function createParqueadero(req, res) {
    try {
        const { nombre, latitud, longitud, capacidad, direccion } = req.body;
        const user_id = req.user.id;

        // Validaciones básicas
        if (!nombre || typeof nombre !== 'string' || nombre.length < 2)
            return res.status(400).json({ error: 'Nombre requerido y válido.' });
        if (typeof latitud !== 'number' || typeof longitud !== 'number')
            return res.status(400).json({ error: 'Latitud y longitud deben ser números.' });
        if (!Number.isInteger(capacidad) || capacidad < 1)
            return res.status(400).json({ error: 'Capacidad debe ser un entero mayor a 0.' });
        if (!direccion || typeof direccion !== 'string' || direccion.length < 3)
            return res.status(400).json({ error: 'Dirección requerida y válida.' });

        // Validar duplicados
        const { data: existe, error: errorExiste } = await supabase
            .from('parqueaderos')
            .select('id')
            .eq('user_id', user_id)
            .eq('nombre', nombre)
            .eq('direccion', direccion)
            .maybeSingle();

        if (errorExiste && errorExiste.code !== 'PGRST116') {
            console.error('Error consultando parqueaderos:', errorExiste.message);
            return res.status(500).json({ error: 'Error verificando duplicados.' });
        }
        if (existe) {
            return res.status(409).json({ error: 'Ya tienes un parqueadero registrado con ese nombre y dirección.' });
        }

        // Crear parqueadero
        const { data: parqueadero, error: errorInsert } = await supabase
            .from('parqueaderos')
            .insert([{ nombre, latitud, longitud, capacidad, direccion, user_id, estado: 'activo' }])
            .select('id, nombre, latitud, longitud, capacidad, direccion, estado, created_at, updated_at')
            .single();

        if (errorInsert) {
            console.error('Error creando parqueadero:', errorInsert.message);
            return res.status(500).json({ error: 'Error al crear el parqueadero.' });
        }

        // Generar los lugares automáticamente según la capacidad
        const lugares = [];
        for (let i = 1; i <= capacidad; i++) {
            lugares.push({
                // Generar ID único si no está disponible
                id: crypto.randomUUID ? crypto.randomUUID() : undefined,
                parqueadero_id: parqueadero.id,
                ocupado: false,
                coordenada_x: 0,
                coordenada_y: i - 1,
                numero: `A${i}`,
                tipo: 'normal',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        // Insertar todos los lugares
        const { data: lugaresInsertados, error: errorLugares } = await supabase
            .from('lugares')
            .insert(lugares)
            .select('id, numero, tipo, ocupado, coordenada_x, coordenada_y, created_at, updated_at');

        if (errorLugares) {
            console.error('Error creando lugares:', errorLugares.message);

            // Revertir la creación del parqueadero
            await supabase
                .from('parqueaderos')
                .delete()
                .eq('id', parqueadero.id);

            return res.status(500).json({ error: 'Error al crear los lugares, operación revertida.' });
        }

        return res.status(201).json({
            message: 'Parqueadero y lugares creados correctamente.',
            parqueadero,
            lugares: lugaresInsertados
        });

    } catch (e) {
        console.error('Error inesperado en createParqueadero:', e);
        return res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
}
/**
 * Listar todos los parqueaderos del usuario autenticado.
 */
export async function getMyParqueaderos(req, res) {
    try {
        const user_id = req.user.id;

        // 1. Buscar parqueaderos del usuario, solo los campos necesarios
        const { data, error } = await supabase
            .from('parqueaderos')
            .select('id, nombre, latitud, longitud, capacidad, direccion, estado, created_at, updated_at')
            .eq('user_id', user_id)
            // .eq('estado', estado || 'activo') // Filtrar solo activos, descomenta esta línea
            .order('created_at', { ascending: false }); // Ordena del más reciente al más antiguo

        if (error) {
            console.error('Error listando parqueaderos:', error.message);
            return res.status(500).json({ error: 'Error al listar parqueaderos.' });
        }

        // Se retorna un array, aunque no tenga parqueaderos
        return res.status(200).json({
            count: data.length,
            data,
            message: data.length === 0
                ? 'No tienes parqueaderos registrados.'
                : 'Parqueaderos encontrados correctamente.'
        });

    } catch (e) {
        console.error('Error inesperado en getMyParqueaderos:', e);
        return res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
}

/**
 * Actualiza un parqueadero propio.
 */
export async function updateParqueadero(req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { nombre, latitud, longitud, capacidad, direccion, estado } = req.body;

        // 1. Verificar propiedad del parqueadero
        const { data: parqueadero, error: errorFind } = await supabase
            .from('parqueaderos')
            .select('user_id')
            .eq('id', id)
            .single();

        if (errorFind) {
            console.error('Error consultando parqueadero:', errorFind.message);
            return res.status(500).json({ error: 'Error consultando parqueadero.' });
        }
        if (!parqueadero) return res.status(404).json({ error: 'Parqueadero no existe.' });
        if (parqueadero.user_id !== user_id) return res.status(403).json({ error: 'No autorizado.' });

        // 2. Validaciones básicas para update (solo campos definidos)
        const updateFields = {};
        if (nombre) updateFields.nombre = nombre;
        if (latitud !== undefined) updateFields.latitud = latitud;
        if (longitud !== undefined) updateFields.longitud = longitud;
        if (capacidad !== undefined) updateFields.capacidad = capacidad;
        if (direccion) updateFields.direccion = direccion;
        if (estado) updateFields.estado = estado;
        updateFields.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('parqueaderos')
            .update(updateFields)
            .eq('id', id)
            .select('id, nombre, latitud, longitud, capacidad, direccion, estado, updated_at')
            .single();

        if (error) {
            console.error('Error actualizando parqueadero:', error.message);
            return res.status(500).json({ error: 'Error actualizando parqueadero.' });
        }
        return res.status(200).json({ message: 'Parqueadero actualizado.', data });
    } catch (e) {
        console.error('Error inesperado en updateParqueadero:', e);
        return res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
}

/**
 * Elimina un parqueadero propio.
 */
export async function deleteParqueadero(req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        // 1. Verificar propiedad del parqueadero
        const { data: parqueadero, error: errorFind } = await supabase
            .from('parqueaderos')
            .select('user_id')
            .eq('id', id)
            .single();

        if (errorFind) {
            console.error('Error consultando parqueadero:', errorFind.message);
            return res.status(500).json({ error: 'Error consultando parqueadero.' });
        }
        if (!parqueadero) return res.status(404).json({ error: 'Parqueadero no existe.' });
        if (parqueadero.user_id !== user_id) return res.status(403).json({ error: 'No autorizado.' });

        // 2. Eliminar parqueadero
        const { error } = await supabase
            .from('parqueaderos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error eliminando parqueadero:', error.message);
            return res.status(500).json({ error: 'Error eliminando parqueadero.' });
        }
        return res.status(200).json({ message: 'Parqueadero eliminado.' });
    } catch (e) {
        console.error('Error inesperado en deleteParqueadero:', e);
        return res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
}
/**
 * Endpoint público: lista todos los parqueaderos activos y su disponibilidad (libres/ocupados)
 */
export async function getDisponibilidadGeneral(req, res) {
    try {
        // 1. Traer todos los parqueaderos activos
        const { data: parqueaderos, error: errorP } = await supabase
            .from('parqueaderos')
            .select('id, nombre, latitud, longitud, direccion, capacidad')
            .eq('estado', 'activo');

        if (errorP) {
            console.error('Error consultando parqueaderos:', errorP.message);
            return res.status(500).json({ error: 'Error consultando parqueaderos.' });
        }

        // 2. Para cada parqueadero, contar ocupados/libres
        const results = await Promise.all(parqueaderos.map(async (p) => {
            const { count: ocupados, error: errorL } = await supabase
                .from('lugares')
                .select('*', { count: 'exact', head: true })
                .eq('parqueadero_id', p.id)
                .eq('ocupado', true);

            // Manejo de error en conteo de lugares
            const libres = p.capacidad - (ocupados ?? 0);

            return {
                id: p.id,
                nombre: p.nombre,
                direccion: p.direccion,
                latitud: p.latitud,
                longitud: p.longitud,
                capacidad: p.capacidad,
                ocupados: ocupados ?? 0,
                libres
            };
        }));

        // 3. (Opcional) Filtrar solo los que tengan al menos un lugar libre
        // const disponibles = results.filter(p => p.libres > 0);

        return res.status(200).json({
            count: results.length,
            parqueaderos: results
        });

    } catch (e) {
        console.error('Error inesperado en getDisponibilidadGeneral:', e);
        return res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
}
