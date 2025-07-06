// Archivo de infraestructura para Calibraciones
// Define las funciones concretas para interactuar con la API REST de calibraciones
// Traduce las operaciones del repositorio a llamadas HTTP reales
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_MOCKAPI_URL_2 || 'https://6855de841789e182b37c8aca.mockapi.io/api/v1';
const API_URL_CALIBRATIONS = `${API_BASE_URL}/calibrations`;

export const calibrationApi = {
  fetchCalibrations: (userId) => axios.get(`${API_URL_CALIBRATIONS}?user_id=${userId}`), // Obtener todas las calibraciones de un usuario
  saveCalibration: (calibration) => axios.post(API_URL_CALIBRATIONS, calibration), // Guardar una nueva calibración
  deleteCalibration: (id) => axios.delete(`${API_URL_CALIBRATIONS}/${id}`) // Eliminar una calibración
}; 