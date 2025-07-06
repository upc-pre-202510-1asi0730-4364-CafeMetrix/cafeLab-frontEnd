// Archivo de infraestructura para Defectos
// Define las funciones concretas para interactuar con la API REST de defectos
// Traduce las operaciones del repositorio a llamadas HTTP reales
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_MOCKAPI_URL_2 || 'https://6855de841789e182b37c8aca.mockapi.io/api/v1';
const API_URL_DEFECTS = `${API_BASE_URL}/defects`;

export const defectApi = {
  fetchDefects: (userId) => axios.get(`${API_URL_DEFECTS}?user_id=${userId}`), // Obtener todos los defectos de un usuario
  fetchDefectById: (id) => axios.get(`${API_URL_DEFECTS}/${id}`), // Obtener un defecto por ID
  saveDefect: (defect) => axios.post(API_URL_DEFECTS, defect), // Guardar un nuevo defecto
  updateDefect: (id, defect) => axios.put(`${API_URL_DEFECTS}/${id}`, defect), // Actualizar un defecto existente
  deleteDefect: (id) => axios.delete(`${API_URL_DEFECTS}/${id}`) // Eliminar un defecto
}; 