import api from '../../shared/config/api.js';

export async function getCuppingSessions() {
    const response = await api.get('/cuppingSessions');
    return response.data;
}

export async function saveCuppingSession(session) {
    if (session.id) {
        const response = await api.put(`/cuppingSessions/${session.id}`, session);
        return response.data;
    } else {
        const response = await api.post('/cuppingSessions', session);
        return response.data;
    }
}

export async function updateSessionRatings(sessionId, newRatings) {
    const response = await api.get(`/cuppingSessions/${sessionId}`);
    const session = response.data;
    session.ratings = { ...newRatings };
    return await api.put(`/cuppingSessions/${sessionId}`, session);
} 