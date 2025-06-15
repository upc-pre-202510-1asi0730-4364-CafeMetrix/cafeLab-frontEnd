import httpInstance from '../../shared/services/http.instance.js';

/**
 * @class UserService
 * @description Service class for handling user-related operations using HTTP requests
 */
export class UserService {
    /** @type {string} The API endpoint for users */
    resourceEndpoint = import.meta.env.VITE_USERS_ENDPOINT_PATH;

    /**
     * Authenticates a user by email and password
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the authenticated user
     */
    login(email, password) {
        return httpInstance.get(`${this.resourceEndpoint}?email=${email}&password=${password}`)
            .then(response => {
                const users = response.data;
                if (users.length === 1) {
                    return users[0];
                } else {
                    throw new Error('Invalid email or password');
                }
            });
    }

    /**
     * Registers a new user
     * @param {Object} user - The user object to register
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the registered user
     */
    register(user) {
        return httpInstance.post(this.resourceEndpoint, user);
    }

    /**
     * Updates a user's profile
     * @param {number} userId - The ID of the user to update
     * @param {Object} updatedUser - The updated user data
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated user
     */
    updateProfile(userId, updatedUser) {
        return httpInstance.put(`${this.resourceEndpoint}/${userId}`, updatedUser);
    }

    /**
     * Retrieves a user by ID
     * @param {number} userId - The ID of the user to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the requested user
     */
    getUserById(userId) {
        return httpInstance.get(`${this.resourceEndpoint}/${userId}`);
    }

    /**
     * Retrieves all users
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of all users
     */
    getAllUsers() {
        return httpInstance.get(this.resourceEndpoint);
    }
}

export default new UserService();