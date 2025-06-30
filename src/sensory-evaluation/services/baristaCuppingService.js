import api from '../../shared/config/api.js';

export async function getBaristaCuppingSessions() {
    const response = await api.get('/baristaCuppingSessions');
    return response.data;
}

export async function saveBaristaCuppingSession(session) {
    const response = await api.post('/baristaCuppingSessions', session);
    return response.data;
}

export async function deleteBaristaCuppingSession(id) {
    const response = await api.delete(`/baristaCuppingSessions/${id}`);
    return response.data;
} 