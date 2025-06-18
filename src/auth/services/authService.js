// src/services/authService.js
import userService from './user.service.js'

export function useAuthService() {

    function sanitizeUser(user) {
        if (!user?.id) {
            console.warn('[AuthService] Usuario sin ID:', user);
            throw new Error('Usuario inválido');
        }
        return { ...user, id: String(user.id) };
    }

    async function login(email, password) {
        const userData = await userService.login(email, password);
        const cleanUser = sanitizeUser(userData);

        localStorage.setItem('currentUser', JSON.stringify(cleanUser));
        return cleanUser;
    }

    function logout() {
        localStorage.removeItem('currentUser');
    }

    function hasConfirmedPlan() {
        const user = getCurrentUser();
        return user?.hasPlan === true;
    }

    function setCurrentUser(user) {
        if (!user || typeof user !== 'object') {
            throw new Error('[AuthService] Usuario inválido al setear');
        }
        const userData = sanitizeUser(user);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }


    async function confirmPlan() {
        const user = getCurrentUser();
        if (!user) {
            console.error('[AuthService] No se encontró usuario actual para confirmar plan');
            return;
        }

        const updatedUser = { ...user, hasPlan: true, plan: user.plan };

        try {
            const response = await userService.updateProfile(user.id, updatedUser);
            const newUser = sanitizeUser(response.data);

            setCurrentUser(newUser);
        } catch (error) {
            console.error('[AuthService] Error al confirmar plan:', error);
        }
    }

    function getCurrentUser() {
        try {
            const userJson = localStorage.getItem('currentUser');
            const parsed = userJson ? JSON.parse(userJson) : null;
            return parsed?.id ? sanitizeUser(parsed) : null;
        } catch (error) {
            logout();
            return null;
        }
    }

    function getCurrentUserId() {
        const user = getCurrentUser();
        return user && user.id ? String(user.id) : '';
    }

    function isLoggedIn() {
        return !!getCurrentUserId();
    }

    function attachUserId(data) {
        const userId = getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        return { ...data, userId };
    }

    return {
        login,
        logout,
        getCurrentUser,
        getCurrentUserId,
        isLoggedIn,
        attachUserId,
        hasConfirmedPlan,
        confirmPlan,
        setCurrentUser
    }
}
