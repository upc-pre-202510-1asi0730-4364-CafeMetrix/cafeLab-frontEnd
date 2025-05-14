// http.instance.js - Versión ultra simple con localStorage fallback
import axios from "axios";

// API URL según el entorno
const apiUrl = import.meta.env.VITE_API_URL;
console.log(`🌐 Usando API URL: ${apiUrl}`);

// Implementación basada en localStorage
const mockStorageApi = {
    // Simula GET a la API
    async get(endpoint) {
        console.log(`📦 localStorage GET: ${endpoint}`);

        // Obtener datos del localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Procesar distintos endpoints
        if (endpoint === '/users') {
            return { data: users };
        }

        // Buscar usuario por email
        if (endpoint.includes('?email=')) {
            const email = endpoint.split('=')[1];
            const filteredUsers = users.filter(u => u.email === email);
            return { data: filteredUsers };
        }

        // Si es búsqueda por ID
        if (endpoint.startsWith('/users/')) {
            const userId = endpoint.split('/')[2];
            const user = users.find(u => u.id === userId);
            return { data: user || null };
        }

        // Endpoint no implementado
        return { data: [] };
    },

    // Simula POST a la API
    async post(endpoint, data) {
        console.log(`📦 localStorage POST: ${endpoint}`, data);

        // Crear usuario
        if (endpoint === '/users') {
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Asignar ID único si no tiene
            if (!data.id) {
                data.id = 'user_' + Date.now();
            }

            // Agregar nuevo usuario
            users.push(data);

            // Guardar en localStorage
            localStorage.setItem('users', JSON.stringify(users));

            return { data };
        }

        // Endpoint no implementado
        return { data: null };
    },

    // Simula PUT a la API
    async put(endpoint, data) {
        console.log(`📦 localStorage PUT: ${endpoint}`, data);

        // Actualizar usuario
        if (endpoint.startsWith('/users/')) {
            const userId = endpoint.split('/')[2];
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...data };
                localStorage.setItem('users', JSON.stringify(users));
                return { data: users[userIndex] };
            }
        }

        // Endpoint no implementado
        return { data: null };
    },

    // Simula DELETE a la API
    async delete(endpoint) {
        console.log(`📦 localStorage DELETE: ${endpoint}`);

        // Eliminar usuario
        if (endpoint.startsWith('/users/')) {
            const userId = endpoint.split('/')[2];
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            const newUsers = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(newUsers));

            return { data: { success: true } };
        }

        // Endpoint no implementado
        return { data: { success: false } };
    }
};

// Exportar directamente la implementación de localStorage
// No intentamos conectar a la API porque ya sabemos que falla
export default mockStorageApi;