import axios from 'axios';
import Inventory from '../model/inventory.entity';

const API = import.meta.env.VITE_API_ADMINISTRATION;

export const saveInventory = (inventory) => axios.post(`${API}/inventory`, new Inventory(inventory));
export const getInventory = () => axios.get(`${API}/inventory`); 