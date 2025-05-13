<template>
  <div class="login-page">
    <div class="background-area"></div>
    <div class="content-container">
      <pv-card class="login-card">
        <template #title>
          <h2>{{ $t('login.title') }}</h2>
        </template>

        <template #content>
          <form @submit.prevent="login">
            <div class="form-group">
              <pv-input-text
                  type="email"
                  v-model="email"
                  :placeholder="$t('login.email_placeholder')"
                  required
                  class="w-full"
                  size="large"
              />
            </div>

            <div class="form-group">
              <pv-password
                  v-model="password"
                  :placeholder="$t('login.password_placeholder')"
                  :feedback="false"
                  toggleMask
                  required
                  class="w-full"
                  size="large"
              />
            </div>

            <div class="form-actions">
              <button
                  type="submit"
                  class="custom-button"
                  :class="{ 'button-submitting': isSubmitting }"
                  :disabled="isSubmitting"
              >
                {{ isSubmitting ? $t('login.submitting') : $t('login.submit') }}
              </button>
            </div>

            <div class="registration-links">
              <p>{{ $t('login.no_account') }}</p>
              <div class="links-container">
                <router-link to="/signup-barista" class="custom-link">{{ $t('login.register_barista') }}</router-link>
                <router-link to="/signup-owner" class="custom-link">{{ $t('login.register_owner') }}</router-link>
              </div>
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </form>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/auth.service.js';

export default {
  name: 'LoginLayout',
  data() {
    return {
      email: '',
      password: '',
      error: null,
      isSubmitting: false
    }
  },
  methods: {
    async login() {
      this.error = null;
      this.isSubmitting = true;

      try {
        if (!this.email || !this.password) {
          this.error = this.$t('login.error_empty_fields');
          this.isSubmitting = false;
          return;
        }

        console.log('Intentando iniciar sesión con:', this.email, this.password);

        // Usar el servicio de autenticación para hacer login
        const user = await AuthService.login(this.email, this.password);

        if (user) {
          // Guardar información del usuario en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));

          console.log('Usuario autenticado:', user);
          console.log('Rol del usuario:', user.role);

          // Verificar si es un usuario nuevo (sin foto de perfil o método de pago)
          const isNewUser = !user.profilePicture || !user.paymentMethod;

          // Si es un usuario nuevo, redirigirlo a completar su perfil
          if (isNewUser) {
            this.$router.push('/edit-profile');
          } else {
            // Redirigir según el rol del usuario
            if (user.role === 'barista') {
              this.$router.push('/barista-home');
            } else if (user.role === 'dueno_cafeteria') {
              this.$router.push('/owner-home');
            }
          }
        } else {
          this.error = this.$t('login.error_invalid_credentials');
        }
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
        this.error = this.$t('login.error_login');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
/* Estilos para abarcar toda la página y eliminar barras de desplazamiento */
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Fondo que cubre toda la pantalla */
.background-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/signin.png'); /* Ruta a la imagen en carpeta public */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

/* Contenedor central para la tarjeta de login */
.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 450px;
  padding: 20px;
  z-index: 1;
}

/* Estilos para la tarjeta de login */
.login-card {
  width: 100%;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15) !important;
  border-radius: 16px !important;
}

:deep(.p-card) {
  border-radius: 16px;
  padding: 10px;
  background-color: white;
}

:deep(.p-card-content) {
  padding: 1.5rem 2rem !important;
}

:deep(.p-card-title) {
  text-align: center;
  padding: 1.5rem 1rem 0.5rem !important;
}

h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

/* Estilos para los campos de entrada */
:deep(.p-inputtext) {
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  border-radius: 8px !important;
}

.form-actions {
  margin-bottom: 2rem;
  margin-top: 2rem;
}

/* Estilo personalizado para el botón */
.custom-button {
  width: 100%;
  height: auto;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  background-color: #4c4c3d;
  color: white;
  border: none;
  border-radius: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.custom-button:hover {
  background-color: white;
  color: #4D6443;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-button:active {
  background-color: transparent;
  color: #4D6443;
  border: 1px solid #4D6443;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #7a7a68;
  border: none;
  color: white;
}

.registration-links {
  text-align: center;
  margin-top: 1.5rem;
}

.registration-links p {
  margin-bottom: 0.5rem;
  color: #777;
  font-size: 0.95rem;
}

.links-container {
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
}

.custom-link {
  color: #4c4c3d;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
}

.custom-link:hover {
  color: #333;
  text-decoration: underline;
}

.error-message {
  margin-top: 1.5rem;
  color: #e53935;
  text-align: center;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: rgba(229, 57, 53, 0.08);
  border-radius: 6px;
}
</style>