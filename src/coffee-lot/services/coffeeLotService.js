import httpInstance from '../../shared/services/http.instance.js';
import { useAuthService } from '../../auth/services/authService';
import { SupplierService} from "../../supply/service/SupplierService.js";

const { getCurrentUserId } = useAuthService();
const supplierService = new SupplierService();


const userId = getCurrentUserId();
if (!userId) throw new Error('Usuario no autenticado');

export class CoffeeLotService {
    /** @type {string} The API endpoint for coffee lots */
    resourceEndpoint = import.meta.env.VITE_COFFEELOT_ENDPOINT_PATH;

    async getLots() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser?.id) {
                throw new Error('Usuario no autenticado o sin ID');
            }

            const { data } = await httpInstance.get(`${this.resourceEndpoint}?user_id=${currentUser.id}`);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getLotById(id) {
        try {
            const { data } = await httpInstance.get(`${this.resourceEndpoint}/${id}`);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async addLot(lot) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser?.id) {
                throw new Error('Usuario no autenticado o sin ID');
            }

            // Validar que haya un supplier_id
            if (!lot.supplier_id) {
                throw new Error('Debe seleccionar un proveedor');
            }

            const suppliers = await supplierService.getAllSuppliers();
            const validSupplier = suppliers.find(s => s.id === lot.supplier_id);
            if (!validSupplier) {
                throw new Error('Proveedor inválido o no pertenece al usuario');
            }

            const lotWithUser = {
                ...lot,
                user_id: currentUser.id
            };

            const { data } = await httpInstance.post(this.resourceEndpoint, lotWithUser);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }


    /**
     * Update an existing coffee lot
     * @param {Object} lot - Coffee lot data (must include `id`)
     * @returns {Promise<Object>} Updated coffee lot
     */
    async update(lot) {
        try {
            const sanitizedLot = { ...lot };
            delete sanitizedLot.user_id;

            const { data } = await httpInstance.put(`${this.resourceEndpoint}/${lot.id}`, sanitizedLot);
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Delete a coffee lot by ID
     * @param {number|string} id - Coffee lot ID
     */
    async delete(id) {
        try {
            await httpInstance.delete(`${this.resourceEndpoint}/${id}`);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Search coffee lots by query
     * @param {string} query - Text to search
     * @returns {Promise<Array>} List of matching lots
     */
    async searchLots(query) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser?.id) {
                throw new Error('Usuario no autenticado o sin ID');
            }

            const { data } = await httpInstance.get(`${this.resourceEndpoint}?lot_name=${encodeURIComponent(query)}&user_id=${currentUser.id}`);
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

export const coffeeLotService = new CoffeeLotService();
