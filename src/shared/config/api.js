import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_MOCKAPI_URL_3 || 'https://6824c1b40f0188d7e72aabca.mockapi.io/api/v1/'
});

export default api;
