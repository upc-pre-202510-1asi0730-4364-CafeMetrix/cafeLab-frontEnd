import api from '../shared/config/api';

// Fake API para movimientos de inventario con persistencia en localStorage
const STORAGE_KEY = 'movimientosInventario';

function loadMovimientos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMovimientos(movs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movs));
}

let movimientos = loadMovimientos();

export async function getMovimientos() {
  const response = await api.get('/movimientosInventario');
  return response.data;
}

export async function registrarConsumo({ fecha, lote, producto, cantidad, tipoCafe }) {
  const nuevoMovimiento = {
    id: Date.now(),
    fecha,
    lote,
    producto,
    cantidad,
    tipoCafe
  };
  const response = await api.post('/movimientosInventario', nuevoMovimiento);
  return response.data;
} 