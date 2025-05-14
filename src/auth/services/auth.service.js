import httpInstance from '../../shared/services/http.instance';
import { User } from '../model/user.entity';

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

            const response = await httpInstance.post('/users', userData);
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
            const response = await httpInstance.get('/users');
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
            const response = await httpInstance.get(`/users?email=${email}`);
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
            const response = await httpInstance.get(`/users?email=${email}`);

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