import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_MOCKAPI_URL_3 || 'http://localhost:5129/api/v1'
});

export default api;
