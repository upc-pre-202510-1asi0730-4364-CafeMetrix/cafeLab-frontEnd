import httpInstance from '../../shared/services/http.instance.js';
import { coffeeLotService } from '../../coffee-lot/services/coffeeLotService.js';

export class RoastProfileService {
    /** @type {string} The API endpoint for roast profiles */
    resourceEndpoint = import.meta.env.VITE_ROASTPROFILE_ENDPOINT_PATH || '/roast-profiles';

    /**
     * Helper to get current user ID from localStorage or throw an error.
     * @private
     */
    getCurrentUserIdOrThrow() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser?.id) {
            throw new Error('Usuario no autenticado o sin ID');
        }
        return currentUser.id;
    }

    /**
     * Get all roast profiles for the current user
     * @returns {Promise<Array>} List of roast profiles
     */
    async getRoastProfiles() {
        try {
            const userId = this.getCurrentUserIdOrThrow();
            const { data } = await httpInstance.get(`${this.resourceEndpoint}?userId=${userId}`);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get roast profile by ID
     * @param {number|string} id - Roast profile ID
     * @returns {Promise<Object>} Roast profile data
     */
    async getRoastProfileById(id) {
        try {
            const { data } = await httpInstance.get(`${this.resourceEndpoint}/${id}`);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get available coffee lots for the current user
     * @returns {Promise<Array>} List of coffee lots
     */
    async getAvailableLots() {
        try {
            return await coffeeLotService.getLots();
        } catch (error) {
            console.error('Error getting coffee lots:', error);
            throw new Error('Error al obtener los lotes de café disponibles');
        }
    }

    /**
     * Create a new roast profile
     * @param {Object} roastProfile - Roast profile data
     * @returns {Promise<Object>} Created roast profile
     */
    async createRoastProfile(roastProfile) {
        try {
            const userId = Number(this.getCurrentUserIdOrThrow());

            if (!roastProfile.coffeeLotId) {
                throw new Error('Debe seleccionar un lote de café');
            }

            const lots = await this.getAvailableLots();
            const validLot = lots.find(lot => Number(lot.id) === Number(roastProfile.coffeeLotId));
            if (!validLot) {
                throw new Error('Lote de café inválido o no pertenece al usuario');
            }

            const roastProfileWithUser = {
                profileName: roastProfile.profileName,
                roastType: roastProfile.roastType,
                duration: Number(roastProfile.duration) || 0,
                coffeeLotId: Number(roastProfile.coffeeLotId),
                tempStart: Number(roastProfile.tempStart) || 0,
                tempEnd: Number(roastProfile.tempEnd) || 0,
                isFavorite: !!roastProfile.isFavorite,
                userId: userId
            };

            const { data } = await httpInstance.post(this.resourceEndpoint, roastProfileWithUser);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update an existing roast profile
     * @param {Object} roastProfile - Roast profile data (must include `id`)
     * @returns {Promise<Object>} Updated roast profile
     */
    async updateRoastProfile(roastProfile) {
        try {
            if (!roastProfile.coffeeLotId) {
                throw new Error('Debe seleccionar un lote de café');
            }

            const lots = await this.getAvailableLots();
            const validLot = lots.find(lot => Number(lot.id) === Number(roastProfile.coffeeLotId));
            if (!validLot) {
                throw new Error('Lote de café inválido o no pertenece al usuario');
            }

            const sanitizedRoastProfile = {
                id: Number(roastProfile.id),
                profileName: roastProfile.profileName,
                roastType: roastProfile.roastType,
                duration: Number(roastProfile.duration) || 0,
                coffeeLotId: Number(roastProfile.coffeeLotId),
                tempStart: Number(roastProfile.tempStart) || 0,
                tempEnd: Number(roastProfile.tempEnd) || 0,
                isFavorite: !!roastProfile.isFavorite,
                userId: Number(roastProfile.userId)
            };

            const { data } = await httpInstance.put(`${this.resourceEndpoint}/${sanitizedRoastProfile.id}`, sanitizedRoastProfile);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Delete a roast profile by ID
     * @param {number|string} id - Roast profile ID
     */
    async deleteRoastProfile(id) {
        try {
            await httpInstance.delete(`${this.resourceEndpoint}/${id}`);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Search roast profiles by query
     * @param {string} query - Text to search
     * @returns {Promise<Array>} List of matching roast profiles
     */
    async searchRoastProfiles(query) {
        try {
            const userId = this.getCurrentUserIdOrThrow();
            const { data } = await httpInstance.get(`${this.resourceEndpoint}/search?profileName=${encodeURIComponent(query)}&userId=${userId}`);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Filter roast profiles by coffee lot
     * @param {number|string} lotId - Coffee lot ID
     * @returns {Promise<Array>} List of roast profiles for the specified lot
     */
    async filterByLot(lotId) {
        try {
            const userId = this.getCurrentUserIdOrThrow();
            const { data } = await httpInstance.get(`${this.resourceEndpoint}?coffeeLotId=${lotId}&userId=${userId}`);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Toggle favorite status for a roast profile
     * @param {string|number} id - Roast profile ID
     * @param {boolean} isFavorite - Current favorite status
     * @returns {Promise<Object>} Updated roast profile
     */
    async toggleFavorite(id, isFavorite) {
        try {
            // 1. Obtén el perfil completo
            const profile = await this.getRoastProfileById(id);
            // 2. Cambia el campo favorito
            profile.isFavorite = !isFavorite;
            // 3. Haz el PUT con el objeto completo
            const { data } = await httpInstance.put(`${this.resourceEndpoint}/${id}`, profile);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Handle and format errors
     * @private
     * @param {any} error - Error object from axios
     */
    handleError(error) {
        let errorMessage = 'Se produjo un error desconocido';

        if (error.response) {
            const { status, statusText } = error.response;
            switch (status) {
                case 404:
                    errorMessage = 'Recurso no encontrado.';
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor.';
                    break;
                default:
                    errorMessage = `Código de error ${status}: ${statusText}`;
                    break;
            }
        } else if (error.request) {
            errorMessage = 'No hubo respuesta del servidor.';
        } else {
            errorMessage = 'Error al configurar la solicitud: ' + error.message;
        }

        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
    }
}

export const roastProfileService = new RoastProfileService(); 