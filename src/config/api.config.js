/**
 * Configuración de la API
 * Este archivo centraliza la configuración de la API para facilitar cambios
 */

// URL base de la API (reemplazar XXXX con el ID de tu proyecto en MockAPI)
export const API_BASE_URL = 'https://6824c1b40f0188d7e72aabca.mockapi.io/api/v1';

// Endpoints de la API
export const API_ENDPOINTS = {
  portfolios: 'portfolios',
  recipes: 'recipes'
};

// Tiempos de espera para peticiones
export const API_TIMEOUTS = {
  default: 10000, // 10 segundos
  long: 30000     // 30 segundos para operaciones que pueden tardar más
}; 