import axios from 'axios';

const localApi = axios.create({
    baseURL: 'http://localhost:5129/api/v1',
    headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
    },
});

export async function getCuppingSessions() {
    const response = await localApi.get('/cuppingsessions');
    return response.data;
}

export async function saveCuppingSession(session) {
    if (session.id) {
        const response = await localApi.put(`/cuppingsessions/${session.id}`, session);
        return response.data;
    } else {
        const response = await localApi.post('/cuppingsessions', session);
        return response.data;
    }
}

export async function updateSessionRatings(sessionId, newRatings) {
    const response = await localApi.get(`/cuppingsessions/${sessionId}`);
    const session = response.data;
    session.ratings = { ...newRatings };
    return await localApi.put(`/cuppingsessions/${sessionId}`, session);
} 