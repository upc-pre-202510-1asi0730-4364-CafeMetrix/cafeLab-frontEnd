import axios from 'axios';
import { User } from '../model/user.entity';

// Configuración de la API
const API_URL = 'http://localhost:3000';

export default {
    /**
     * Registra un nuevo usuario en el sistema
     * @param {User} userData - Datos del usuario a registrar
     * @returns {Promise} - Promesa con la respuesta del servidor
     */
    async register(userData) {
        try {
            // Marcar como primer inicio de sesión
            userData.isFirstLogin = true;

            const response = await axios.post(`${API_URL}/users`, userData);
            return response.data;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    },

    /**
     * Obtiene todos los usuarios registrados
     * @returns {Promise} - Promesa con la lista de usuarios
     */
    async getUsers() {
        try {
            const response = await axios.get(`${API_URL}/users`);
            console.log('Usuarios obtenidos:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    /**
     * Busca un usuario por su correo electrónico
     * @param {string} email - Correo electrónico del usuario
     * @returns {Promise} - Promesa con el usuario encontrado o null
     */
    async findUserByEmail(email) {
        try {
            console.log('Buscando usuario por email:', email);
            const response = await axios.get(`${API_URL}/users?email=${email}`);
            console.log('Resultado de búsqueda:', response.data);
            return response.data.length > 0 ? response.data[0] : null;
        } catch (error) {
            console.error('Error buscando usuario por email:', error);
            return null;
        }
    },

    /**
     * Intenta iniciar sesión con email y contraseña
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} - Promesa con el usuario si las credenciales son correctas
     */
    async login(email, password) {
        try {
            console.log('Intentando login con:', { email, password });
            const response = await axios.get(`${API_URL}/users?email=${email}`);

            if (response.data.length > 0) {
                const user = response.data[0];
                // Verificar la contraseña
                if (user.password === password) {
                    console.log('Login exitoso');

                    // Asegurarse de que hasPlan exista si el usuario ya seleccionó un plan
                    if (user.hasPlan === "true") {
                        user.hasPlan = true;
                    }

                    // Guardar en localStorage
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    return user;
                }
                console.log('Contraseña incorrecta');
            }
            console.log('Usuario no encontrado');
            return null;
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            throw new Error('Error de autenticación');
        }
    }
};