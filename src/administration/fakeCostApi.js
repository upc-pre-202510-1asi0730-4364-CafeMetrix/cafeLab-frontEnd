import api from '../shared/config/api';

// Fake API para registros de costos de lote con persistencia en localStorage
const STORAGE_KEY = 'costosLote';

function loadCostRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCostRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export async function getCostRecords() {
  const response = await api.get('/costosLote');
  return response.data;
}

export async function saveCostRecord(record) {
  const response = await api.post('/costosLote', record);
  return response.data;
} 