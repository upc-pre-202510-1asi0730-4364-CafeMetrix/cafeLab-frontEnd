import axios from 'axios';

const localApi = axios.create({
    baseURL: 'http://localhost:5129/api/v1',
    headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
    },
});

export async function getBaristaCuppingSessions(userId) {
    const response = await localApi.get(`/barista-cupping-sessions/user/${userId}`);
    return response.data;
}

export async function saveBaristaCuppingSession(session) {
    const response = await localApi.post('/barista-cupping-sessions', session);
    return response.data;
}

export async function deleteBaristaCuppingSession(id) {
    const response = await localApi.delete(`/barista-cupping-sessions/${id}`);
    return response.data;
} 