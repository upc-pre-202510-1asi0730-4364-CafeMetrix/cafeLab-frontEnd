import api from '../../shared/services/api';

export async function getMovimientos() {
    const response = await api.get('/movimientosInventario');
    return response.data;
}

export async function registrarConsumo(data) {
    const nuevoMovimiento = {
        id: Date.now(),
        ...data
    };
    const response = await api.post('/movimientosInventario', nuevoMovimiento);
    return response.data;
}

export async function updateMovimiento(id, data) {
    const response = await api.put(`/movimientosInventario/${id}`, data);
    return response.data;
}

export async function deleteMovimiento(id) {
    const response = await api.delete(`/movimientosInventario/${id}`);
    return response.data;
} 