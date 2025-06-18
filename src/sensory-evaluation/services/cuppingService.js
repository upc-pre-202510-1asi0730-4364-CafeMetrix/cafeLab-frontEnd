import api from '../../shared/services/api';
import { useAuthService } from '../../auth/services/authService';

const authService = useAuthService();

export async function getCuppingSessions() {
    const user_id = authService.getCurrentUserId();
    const response = await api.get(`/cuppingSessions?user_id=${user_id}`);
    return response.data;
}

export async function saveCuppingSession(session) {
    const user_id = authService.getCurrentUserId();
    if (!user_id) throw new Error('No user logged in');

    const sessionWithUser = {
        ...session,
        user_id, // CORRECTO
    };

    if (session.id) {
        const response = await api.put(`/cuppingSessions/${session.id}`, sessionWithUser);
        return response.data;
    } else {
        const response = await api.post('/cuppingSessions', sessionWithUser);
        return response.data;
    }
}

export async function updateSessionRatings(sessionId, newRatings) {
    const response = await api.get(`/cuppingSessions/${sessionId}`);
    const session = response.data;

    const updatedSession = {
        ...session,
        ratings: { ...newRatings },
        user_id: session.user_id // asegúrate de mantenerlo
    };

    return await api.put(`/cuppingSessions/${sessionId}`, updatedSession);
}
