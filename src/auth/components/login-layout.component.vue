<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>

      <form @submit.prevent="login">
        <div class="form-group">
          <input
              type="email"
              v-model="email"
              placeholder="Correo electrónico"
              required
          />
        </div>

        <div class="form-group">
          <input
              type="password"
              v-model="password"
              placeholder="Contraseña"
              required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <div class="registration-links">
          <p>¿No tienes una cuenta?</p>
          <div class="links-container">
            <router-link to="/signup-barista">Regístrate como Barista</router-link>
            <router-link to="/signup-owner">Regístrate como Dueño</router-link>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
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
          this.error = 'Por favor, completa todos los campos';
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
          this.error = 'Credenciales incorrectas';
        }
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
        this.error = 'Ocurrió un error al iniciar sesión';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4c4c3d;
}

.form-actions {
  margin-bottom: 1.5rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #4c4c3d;
  color: white;
}

.registration-links {
  text-align: center;
  margin-top: 1.5rem;
}

.registration-links p {
  margin-bottom: 0.5rem;
  color: #777;
}

.links-container {
  display: flex;
  justify-content: space-between;
}

.links-container a {
  color: #4c4c3d;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.links-container a:hover {
  color: #333;
  text-decoration: underline;
}

.error-message {
  margin-top: 1rem;
  color: #e53935;
  text-align: center;
  font-size: 0.9rem;
}
</style>