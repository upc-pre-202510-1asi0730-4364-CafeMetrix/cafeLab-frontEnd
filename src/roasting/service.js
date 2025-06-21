import axios from 'axios';
import { Calibration, Defect } from './model';

const API_BASE_URL = import.meta.env.VITE_MOCKAPI_URL_2 || 'https://6855de841789e182b37c8aca.mockapi.io/api/v1';

const API_URL_DEFECTS = `${API_BASE_URL}/defects`;
const API_URL_CALIBRATIONS = `${API_BASE_URL}/calibrations`;

console.log('DEBUG: Conectando a la API de Defectos en:', API_URL_DEFECTS);

// Calibrations
export const getAllCalibrations = () => axios.get(API_URL_CALIBRATIONS);
export const saveCalibration = (calibration) => axios.post(`${API_URL_CALIBRATIONS}`, new Calibration(calibration));

// Defects
export const getAllDefects = () => axios.get(API_URL_DEFECTS);
export const getDefectById = (id) => axios.get(`${API_URL_DEFECTS}/${id}`);
export const createDefect = (defectData) => axios.post(API_URL_DEFECTS, defectData);
export const updateDefect = (id, defect) => axios.put(`${API_URL_DEFECTS}/${id}`, defect);
export const deleteDefect = (id) => axios.delete(`${API_URL_DEFECTS}/${id}`);

// Agrega aquí otros servicios SOLO si realmente se usan en el contexto de roasting. 