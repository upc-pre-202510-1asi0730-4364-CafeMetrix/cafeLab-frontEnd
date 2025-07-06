import axios from 'axios';

const localApi = axios.create({
    baseURL: 'http://localhost:5129/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
});

export async function getCostRecords() {
    const response = await localApi.get('/costoslote');
    return response.data;
}

export async function saveCostRecord(record) {
    const response = await localApi.post('/costoslote', record);
    return response.data;
}

export async function updateCostRecord(id, record) {
    const response = await localApi.put(`/costoslote/${id}`, record);
    return response.data;
}

export async function deleteCostRecord(id) {
    const response = await localApi.delete(`/costoslote/${id}`);
    return response.data;
}