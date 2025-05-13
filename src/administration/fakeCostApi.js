// Fake API para registros de costos de lote con persistencia en localStorage
const STORAGE_KEY = 'costosLote';

function loadCostRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCostRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getCostRecords() {
  return Promise.resolve(loadCostRecords());
}

export function saveCostRecord(record) {
  const records = loadCostRecords();
  records.push({ ...record, id: Date.now() });
  saveCostRecords(records);
  return Promise.resolve(record);
} 