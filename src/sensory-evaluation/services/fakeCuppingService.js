import {
    fetchFakeCuppings,
    addFakeCuppingSession,
    updateFakeCuppingSession
} from './fakeCuppingApi'

export async function getCuppingSessions() {
    return await fetchFakeCuppings()
}

export async function saveCuppingSession(session) {
    if (session.id) {
        return await updateFakeCuppingSession(session.id, session)
    } else {
        return await addFakeCuppingSession(session)
    }
}
export function updateSessionRatings(sessionId, newRatings) {
    const stored = localStorage.getItem('cuppingSessions')
    const sessions = stored ? JSON.parse(stored) : []

    const index = sessions.findIndex(s => s.id === Number(sessionId))
    if (index !== -1) {
        sessions[index].ratings = { ...newRatings }
        localStorage.setItem('cuppingSessions', JSON.stringify(sessions))
        return true
    }
    return false
}

