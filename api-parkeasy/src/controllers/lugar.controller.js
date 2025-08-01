import { supabase } from '../config/supabaseClient.js';

/**
 * Lista todos los lugares de un parqueadero, solo si el usuario es dueño.
 */
export async function listLugaresByParqueadero(req, res) {
    try {
        const parqueadero_id = req.params.parqueadero_id;
        const user_id = req.user.id;

        // Validar que el parqueadero es del usuario
        const { data: parqueadero, error: errorParq } = await supabase
            .from('parqueaderos')
            .select('id, user_id')
            .eq('id', parqueadero_id)
            .single();

        if (errorParq) {
            console.error('Error consultando parqueadero:', errorParq.message);
            return res.status(500).json({ error: 'Error consultando parqueadero.' });
        }
        if (!parqueadero) return res.status(404).json({ error: 'Parqueadero no encontrado.' });
        if (parqueadero.user_id !== user_id) return res.status(403).json({ error: 'No autorizado.' });

        // Buscar los lugares
        const { data, error } = await supabase
            .from('lugares')
            .select('id, numero, tipo, ocupado, coordenada_x, coordenada_y, created_at, updated_at')
            .eq('parqueadero_id', parqueadero_id)
            .order('numero', { ascending: true });

        if (error) {
            console.error('Error listando lugares:', error.message);
            return res.status(500).json({ error: 'Error al listar lugares.' });
        }

        return res.status(200).json({
            count: data.length,
            data,
            message: data.length === 0
                ? 'No existen lugares para este parqueadero.'
                : 'Lugares encontrados correctamente.'
        });

    } catch (e) {
        console.error('Error inesperado en listLugaresByParqueadero:', e);
        return res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
}

/**
 * Actualiza el estado o datos de un lugar, solo si el usuario es dueño del parqueadero.
 */
export async function updateLugar(req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { ocupado, tipo, coordenada_x, coordenada_y, numero } = req.body;

        // 1. Buscar el lugar y su parqueadero asociado
        const { data: lugar, error: errorLugar } = await supabase
            .from('lugares')
            .select('id, parqueadero_id')
            .eq('id', id)
            .single();

        if (errorLugar) {
            console.error('Error consultando lugar:', errorLugar.message);
            return res.status(500).json({ error: 'Error consultando lugar.' });
        }
        if (!lugar) return res.status(404).json({ error: 'Lugar no encontrado.' });

        // 2. Verificar propiedad del parqueadero
        const { data: parqueadero, error: errorParq } = await supabase
            .from('parqueaderos')
            .select('user_id')
            .eq('id', lugar.parqueadero_id)
            .single();

        if (errorParq) {
            console.error('Error consultando parqueadero:', errorParq.message);
            return res.status(500).json({ error: 'Error consultando parqueadero.' });
        }
        if (!parqueadero) return res.status(404).json({ error: 'Parqueadero no encontrado.' });
        if (parqueadero.user_id !== user_id) return res.status(403).json({ error: 'No autorizado.' });

        // 3. Validar y construir los campos a actualizar
        const updateFields = {};
        if (ocupado !== undefined) updateFields.ocupado = ocupado;
        if (tipo) updateFields.tipo = tipo;
        if (coordenada_x !== undefined) updateFields.coordenada_x = coordenada_x;
        if (coordenada_y !== undefined) updateFields.coordenada_y = coordenada_y;
        if (numero) updateFields.numero = numero;
        updateFields.updated_at = new Date().toISOString();

        if (Object.keys(updateFields).length === 1) // solo updated_at
            return res.status(400).json({ error: 'No se enviaron campos para actualizar.' });

        // 4. Actualizar
        const { data, error } = await supabase
            .from('lugares')
            .update(updateFields)
            .eq('id', id)
            .select('id, numero, tipo, ocupado, coordenada_x, coordenada_y, updated_at')
            .single();

        if (error) {
            console.error('Error actualizando lugar:', error.message);
            return res.status(500).json({ error: 'Error actualizando lugar.' });
        }

        return res.status(200).json({
            message: 'Lugar actualizado correctamente.',
            data
        });

    } catch (e) {
        console.error('Error inesperado en updateLugar:', e);
        return res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
}
