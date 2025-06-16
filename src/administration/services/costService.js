import api from '../../shared/config/api';

export async function getCostRecords() {
    const response = await api.get('/costosLote');
    return response.data;
}

export async function saveCostRecord(record) {
    const response = await api.post('/costosLote', record);
    return response.data;
}

export async function updateCostRecord(id, record) {
    const response = await api.put(`/costosLote/${id}`, record);
    return response.data;
}

export async function deleteCostRecord(id) {
    const response = await api.delete(`/costosLote/${id}`);
    return response.data;
} 