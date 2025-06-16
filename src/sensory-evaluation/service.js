import axios from 'axios';
import { Tasting } from './model';

const API = import.meta.env.VITE_API_SENSORY;

// Tasting
export const saveTasting = (tasting) => axios.post(`${API}/tastings`, new Tasting(tasting));
export const getTastings = () => axios.get(`${API}/tastings`);
// Agrega aquí otros servicios SOLO si realmente se usan en el contexto de sensory-evaluation. 