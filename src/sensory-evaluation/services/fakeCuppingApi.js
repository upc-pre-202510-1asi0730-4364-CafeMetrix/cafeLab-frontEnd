import api from '../../shared/config/api';

export async function fetchFakeCuppings() {
    const response = await api.get('/cuppingSessions');
    return response.data;
}

export async function addFakeCuppingSession(newSession) {
    const response = await api.post('/cuppingSessions', newSession);
    return response.data;
}

export async function updateFakeCuppingSession(id, updatedData) {
    const response = await api.put(`/cuppingSessions/${id}`, updatedData);
    return response.data;
}
