import axios from 'axios';
import { API_BASE_URL, API_TIMEOUTS } from '../../config/api.config';

/**
 * Servicio base para acceder a la API
 */
export class ApiService {
  constructor() {
    // Usar la URL base desde la configuración
    this.baseUrl = API_BASE_URL;
    
    // Crear instancia de axios con configuración base
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: API_TIMEOUTS.default
    });
    
    // Añadir interceptores para manejo de errores
    this._setupInterceptors();
  }

  /**
   * Configura interceptores para peticiones y respuestas
   * @private
   */
  _setupInterceptors() {
    // Interceptor de peticiones
    this.api.interceptors.request.use(
      config => {
        // Aquí podríamos añadir tokens de autenticación, etc.
        console.log('Enviando petición a:', config.url);
        return config;
      },
      error => {
        console.error('Error en la petición:', error);
        return Promise.reject(error);
      }
    );
    
    // Interceptor de respuestas
    this.api.interceptors.response.use(
      response => {
        console.log('Respuesta recibida de:', response.config.url);
        return response.data;
      },
      error => {
        if (error.response) {
          // La petición fue realizada y el servidor respondió con un código de error
          console.error('Error de respuesta:', error.response.status, error.response.data);
        } else if (error.request) {
          // La petición fue realizada pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor');
        } else {
          // Error en la configuración de la petición
          console.error('Error en la configuración de la petición:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtener datos de la API
   * @param {string} endpoint - Endpoint de la API
   * @returns {Promise<any>} - Datos de la API
   */
  async get(endpoint) {
    try {
      return await this.api.get(endpoint);
    } catch (error) {
      console.error(`Error al obtener datos de ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Crear un recurso en la API
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Recurso creado
   */
  async post(endpoint, data) {
    try {
      return await this.api.post(endpoint, data);
    } catch (error) {
      console.error(`Error al crear recurso en ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar un recurso en la API
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Recurso actualizado
   */
  async put(endpoint, data) {
    try {
      return await this.api.put(endpoint, data);
    } catch (error) {
      console.error(`Error al actualizar recurso en ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar parcialmente un recurso en la API
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Recurso actualizado
   */
  async patch(endpoint, data) {
    try {
      return await this.api.patch(endpoint, data);
    } catch (error) {
      console.error(`Error al actualizar parcialmente recurso en ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un recurso de la API
   * @param {string} endpoint - Endpoint de la API
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  async delete(endpoint) {
    try {
      await this.api.delete(endpoint);
      return true;
    } catch (error) {
      console.error(`Error al eliminar recurso en ${endpoint}:`, error);
      throw error;
    }
  }
} 