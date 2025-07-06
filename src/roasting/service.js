import axios from 'axios';
import { Calibration, Defect } from './model';

const API_BASE_URL = import.meta.env.VITE_MOCKAPI_URL_2 || 'https://6855de841789e182b37c8aca.mockapi.io/api/v1';

const API_URL_DEFECTS = `${API_BASE_URL}/defects`;
const API_URL_CALIBRATIONS = `${API_BASE_URL}/calibrations`;

console.log('DEBUG: Conectando a la API de Defectos en:', API_URL_DEFECTS);

// Calibrations
export const getAllCalibrations = (user_id) => axios.get(`${API_URL_CALIBRATIONS}?user_id=${user_id}`);
export const saveCalibration = (calibration, user_id) => axios.post(`${API_URL_CALIBRATIONS}`, { ...calibration, user_id });
export const deleteCalibration = (id) => axios.delete(`${API_URL_CALIBRATIONS}/${id}`);

// Defects
export const getAllDefects = (user_id) => axios.get(`${API_URL_DEFECTS}?user_id=${user_id}`);
export const getDefectById = (id) => axios.get(`${API_URL_DEFECTS}/${id}`);
export const createDefect = (defectData, user_id) => axios.post(API_URL_DEFECTS, { ...defectData, user_id });
export const updateDefect = (id, defect) => axios.put(`${API_URL_DEFECTS}/${id}`, defect);
export const deleteDefect = (id) => axios.delete(`${API_URL_DEFECTS}/${id}`);

// Agrega aquí otros servicios SOLO si realmente se usan en el contexto de roasting. 