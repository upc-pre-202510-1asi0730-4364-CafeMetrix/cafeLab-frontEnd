import axios from 'axios';
import { Calibration, Defect } from './model';

const API = 'http://localhost:3000'; // Forzado para pruebas

// Calibrations
export const getCalibrations = () => axios.get(`${API}/calibrations`);
export const saveCalibration = (calibration) => axios.post(`${API}/calibrations`, new Calibration(calibration));

// Defects
export const getAllDefects = () => axios.get(`${API}/defects`);
export const getDefectById = (id) => axios.get(`${API}/defects/${id}`);
export const createDefect = (defect) => axios.post(`${API}/defects`, new Defect(defect));
export const updateDefect = (id, defect) => axios.put(`${API}/defects/${id}`, defect);
export const deleteDefect = (id) => axios.delete(`${API}/defects/${id}`);

// Agrega aquí otros servicios SOLO si realmente se usan en el contexto de roasting. 