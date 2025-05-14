import httpInstance from '../../shared/services/http.instance';

export default {
    /**
     * Actualiza el perfil del usuario
     * @param {Object} userData - Datos del usuario a actualizar
     * @returns {Promise} - Promesa con la respuesta del servidor
     */
    async updateProfile(userData) {
        try {
            console.log('Actualizando perfil:', userData);
            const userId = userData.id;

            // Asegurarse de que los campos críticos estén presentes
            if (userData.profilePicture === undefined || userData.profilePicture === null) {
                userData.profilePicture = '';
            }

            if (userData.paymentMethod === undefined || userData.paymentMethod === null) {
                userData.paymentMethod = '';
            }

            // Recuperamos los datos del usuario actual para no perder campos
            let currentUser = {};
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                try {
                    currentUser = JSON.parse(userStr);
                } catch (e) {
                    console.error('Error al parsear el usuario del localStorage:', e);
                }
            }

            // Preservar el campo hasPlan si ya existe
            if (currentUser.hasPlan) {
                userData.hasPlan = true;
            }

            // Verificar si es la primera vez que edita el perfil
            const isFirstTimeEdit = currentUser.isFirstLogin !== false;

            // Combinamos los datos actuales con los nuevos
            const updatedUser = { ...currentUser, ...userData };

            // Asegurarnos de que los campos críticos se mantengan
            updatedUser.profilePicture = userData.profilePicture;
            updatedUser.paymentMethod = userData.paymentMethod;

            // Después de la primera edición de perfil, marcamos isFirstLogin como false
            if (isFirstTimeEdit) {
                updatedUser.isFirstLogin = false;
            }

            console.log('Usuario actualizado a enviar:', updatedUser);

            // Enviamos la solicitud al servidor utilizando httpInstance
            const response = await httpInstance.put(`/users/${userId}`, updatedUser);
            console.log('Respuesta del servidor:', response.data);

            // Actualizamos el usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Verificar lo que quedó guardado
            console.log('Guardado en localStorage:', JSON.parse(localStorage.getItem('currentUser')));

            // Retornar la información de si es primera edición junto con los datos
            return {
                ...response.data,
                isFirstTimeEdit
            };
        } catch (error) {
            console.error('Error al actualizar perfil:', error);

            // Intentar guardar en localStorage de todos modos
            try {
                if (userData && userData.id) {
                    // Asegurar que los campos críticos estén presentes
                    if (userData.profilePicture === undefined || userData.profilePicture === null) {
                        userData.profilePicture = '';
                    }

                    if (userData.paymentMethod === undefined || userData.paymentMethod === null) {
                        userData.paymentMethod = '';
                    }

                    // Verificar si es la primera vez que edita el perfil
                    const currentUserStr = localStorage.getItem('currentUser');
                    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : {};
                    const isFirstTimeEdit = currentUser.isFirstLogin !== false;

                    // Después de la primera edición de perfil, marcamos isFirstLogin como false
                    if (isFirstTimeEdit) {
                        userData.isFirstLogin = false;
                    }

                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    console.log('Guardado de emergencia en localStorage:', userData);

                    // Retornar información sobre si es primera edición
                    return {
                        ...userData,
                        isFirstTimeEdit
                    };
                }
            } catch (e) {
                console.error('Error al guardar en localStorage:', e);
            }

            throw error;
        }
    },

    /**
     * Sube una imagen de perfil
     * @param {Object} file - Archivo de imagen a subir
     * @returns {Promise<string>} - URL de la imagen subida
     */
    async uploadProfileImage(file) {
        try {
            // En un caso real, aquí enviaríamos la imagen a un servidor
            // Para este ejemplo, convertimos la imagen a base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            throw error;
        }
    },

    /**
     * Obtiene el perfil completo del usuario
     * @returns {Promise<Object>} - Datos del perfil del usuario
     */
    async getFullProfile() {
        try {
            // Obtener usuario del localStorage
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) {
                throw new Error('Usuario no autenticado');
            }

            const user = JSON.parse(userStr);
            const userId = user.id;
            const response = await httpInstance.get(`/users/${userId}`);

            // Asegurarnos de que los campos críticos estén presentes en la respuesta
            const profileData = response.data;
            if (!profileData.profilePicture) profileData.profilePicture = '';
            if (!profileData.paymentMethod) profileData.paymentMethod = '';

            // Verificar si es la primera vez que inicia sesión
            if (profileData.isFirstLogin === undefined) {
                profileData.isFirstLogin = true; // Por defecto asumimos que es primer inicio
            }

            return profileData;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            throw error;
        }
    },

    /**
     * Actualiza el método de pago del usuario
     * @param {string} paymentMethod - Método de pago ('visa' o 'mastercard')
     * @returns {Promise} - Promesa con la respuesta del servidor
     */
    async updatePaymentMethod(paymentMethod) {
        try {
            // Obtener usuario del localStorage
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) {
                throw new Error('Usuario no autenticado');
            }

            const user = JSON.parse(userStr);
            const userId = user.id;
            const updatedUser = { ...user, paymentMethod };

            const response = await httpInstance.put(`/users/${userId}`, updatedUser);

            // Actualizamos el usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            return response.data;
        } catch (error) {
            console.error('Error al actualizar método de pago:', error);
            throw error;
        }
    },

    /**
     * Verifica si es la primera vez que el usuario inicia sesión
     * @returns {boolean} - true si es la primera vez, false en caso contrario
     */
    isFirstLogin() {
        try {
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) return true;

            const user = JSON.parse(userStr);
            // Si isFirstLogin es undefined o true, consideramos que es el primer inicio de sesión
            return user.isFirstLogin !== false;
        } catch (e) {
            console.error('Error al verificar primer inicio de sesión:', e);
            return true; // Por defecto, asumimos que es la primera vez
        }
    },

    /**
     * Marca que ya no es el primer inicio de sesión del usuario
     */
    markAsNotFirstLogin() {
        try {
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) return;

            const user = JSON.parse(userStr);
            user.isFirstLogin = false;
            localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (e) {
            console.error('Error al marcar como no primer inicio:', e);
        }
    }
};