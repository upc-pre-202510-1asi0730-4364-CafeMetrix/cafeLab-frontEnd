// modules/supplier/services/supplier.service.js
import httpInstance from '../../shared/services/http.instance.js';

export class SupplierService {
  /** @type {string} The API endpoint for suppliers */
  resourceEndpoint = import.meta.env.VITE_SUPPLIERS_ENDPOINT_PATH;


  async getAllSuppliers() {
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



  async addSupplier(supplier) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (!currentUser?.id) {
        throw new Error('Usuario no autenticado o sin ID');
      }

      const supplierWithUser = {
        ...supplier,
        user_id: currentUser.id
      };

      const { data } = await httpInstance.post(this.resourceEndpoint, supplierWithUser);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }


  /**
   * Update an existing supplier
   * @param {Object} supplier - Supplier data (must include `id`)
   * @returns {Promise<Object>} Updated supplier
   */
  async update(supplier) {
    try {
      const sanitizedSupplier = { ...supplier };
      delete sanitizedSupplier.user_id;

      const { data } = await httpInstance.put(`${this.resourceEndpoint}/${supplier.id}`, sanitizedSupplier);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete a supplier by ID
   * @param {number|string} id - Supplier ID
   */
  async delete(id) {
    try {
      await httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Search suppliers by query
   * @param {string} query - Text to search
   * @returns {Promise<Array>} List of matching suppliers
   */
  async searchSuppliers(query) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser?.id) {
        throw new Error('Usuario no autenticado o sin ID');
      }

      const { data } = await httpInstance.get(`${this.resourceEndpoint}?name=${encodeURIComponent(query)}&user_id=${currentUser.id}`);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }



  /*
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

export const supplierService = new SupplierService();
