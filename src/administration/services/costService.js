import axios from 'axios';
import Cost from '../model/cost.entity';

const API = import.meta.env.VITE_API_ADMINISTRATION;

export const saveCost = (cost) => axios.post(`${API}/costs`, new Cost(cost));
export const getCosts = () => axios.get(`${API}/costs`); 