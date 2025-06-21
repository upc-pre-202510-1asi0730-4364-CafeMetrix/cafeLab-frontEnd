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
            const { data } = await httpInstance.get(`${this.resourceEndpoint}?user_id=${userId}`);
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
            const userId = this.getCurrentUserIdOrThrow();

            // Validate that coffee_lot_id is provided
            if (!roastProfile.coffee_lot_id) {
                throw new Error('Debe seleccionar un lote de café');
            }

            // Validate that the coffee lot exists and belongs to the user
            const lots = await this.getAvailableLots();
            const validLot = lots.find(lot => lot.id === roastProfile.coffee_lot_id);
            if (!validLot) {
                throw new Error('Lote de café inválido o no pertenece al usuario');
            }

            const roastProfileWithUser = {
                ...roastProfile,
                user_id: userId
            };

            console.log('[DEBUG] Payload FINAL enviado al backend:', roastProfileWithUser);

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
            // Validate that coffee_lot_id is provided
            if (!roastProfile.coffee_lot_id) {
                throw new Error('Debe seleccionar un lote de café');
            }

            // Validate that the coffee lot exists and belongs to the user
            const lots = await this.getAvailableLots();
            const validLot = lots.find(lot => lot.id === roastProfile.coffee_lot_id);
            if (!validLot) {
                throw new Error('Lote de café inválido o no pertenece al usuario');
            }

            const sanitizedRoastProfile = { ...roastProfile };
            delete sanitizedRoastProfile.user_id;

            const { data } = await httpInstance.put(`${this.resourceEndpoint}/${roastProfile.id}`, sanitizedRoastProfile);
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
            const { data } = await httpInstance.get(`${this.resourceEndpoint}?profile_name=${encodeURIComponent(query)}&user_id=${userId}`);
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
            const { data } = await httpInstance.get(`${this.resourceEndpoint}?coffee_lot_id=${lotId}&user_id=${userId}`);
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
            const { data } = await httpInstance.put(`${this.resourceEndpoint}/${id}`, { is_favorite: !isFavorite });
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