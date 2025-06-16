import axios from 'axios';
import { Cost, Inventory } from './model';

const API = import.meta.env.VITE_API_ADMINISTRATION;

// Cost
export const saveCost = (cost) => axios.post(`${API}/costs`, new Cost(cost));
export const getCosts = () => axios.get(`${API}/costs`);

// Inventory
export const saveInventory = (inventory) => axios.post(`${API}/inventory`, new Inventory(inventory));
export const getInventory = () => axios.get(`${API}/inventory`);
// Agrega aquí otros servicios SOLO si realmente se usan en el contexto de administration. 