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
  movimientos = loadMovimientos();
  return Promise.resolve([...movimientos]);
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
  movimientos.unshift(nuevoMovimiento);
  saveMovimientos(movimientos);
  return Promise.resolve(nuevoMovimiento);
} 