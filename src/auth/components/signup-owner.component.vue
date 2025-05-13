<template>
  <div class="signup-container">
    <div class="signup-card">
      <h2>Registro de Dueño de Cafetería</h2>

      <form @submit.prevent="signup">
        <div class="form-group">
          <input
              type="text"
              v-model="user.name"
              placeholder="Nombre completo"
              required
          />
        </div>

        <div class="form-group">
          <input
              type="email"
              v-model="user.email"
              placeholder="Correo electrónico"
              required
          />
        </div>

        <div class="form-group">
          <input
              type="text"
              v-model="user.cafeteriaName"
              placeholder="Nombre de cafetería"
              required
          />
        </div>

        <div class="form-group">
          <input
              type="text"
              v-model="user.experience"
              placeholder="Experiencia (ej: 5 años)"
          />
        </div>

        <div class="form-group">
          <input
              type="password"
              v-model="user.password"
              placeholder="Contraseña"
              required
          />
        </div>

        <div class="form-group">
          <input
              type="password"
              v-model="confirmPassword"
              placeholder="Confirmar contraseña"
              required
          />
        </div>

        <div class="form-group checkbox-group">
          <input
              id="terms"
              type="checkbox"
              v-model="termsAccepted"
              required
          />
          <label for="terms">Acepto los términos y condiciones</label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="goBack">Volver</button>
          <button type="submit" class="btn-primary" :disabled="!isFormValid || isSubmitting">
            {{ isSubmitting ? 'Registrando...' : 'Registrarse' }}
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { User } from '../model/user.entity.js';
import AuthService from '../services/auth.service.js';

export default {
  name: 'SignupOwner',
  data() {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'dueno_cafeteria',
        cafeteriaName: '',
        experience: ''
      },
      confirmPassword: '',
      termsAccepted: false,
      error: null,
      success: null,
      isSubmitting: false
    }
  },
  computed: {
    isFormValid() {
      return this.user.name &&
          this.user.email &&
          this.user.cafeteriaName &&
          this.user.password &&
          this.confirmPassword &&
          this.user.password === this.confirmPassword &&
          this.termsAccepted;
    }
  },
  methods: {
    async signup() {
      // Reset messages
      this.error = null;
      this.success = null;
      this.isSubmitting = true;

      try {
        // Validate passwords match
        if (this.user.password !== this.confirmPassword) {
          this.error = 'Las contraseñas no coinciden';
          this.isSubmitting = false;
          return;
        }

        // Check if email already exists
        const existingUser = await AuthService.findUserByEmail(this.user.email);
        if (existingUser) {
          this.error = 'El correo electrónico ya está registrado';
          this.isSubmitting = false;
          return;
        }

        // Create a new user with the User entity
        const newUser = new User(this.user);

        // Generar un ID único
        newUser.id = 'b_' + Date.now();

        // Marcar como primer inicio de sesión
        newUser.isFirstLogin = true;

        console.log('Registrando barista:', newUser);

        // Limpiar localStorage antes de guardar nuevo usuario
        localStorage.removeItem('currentUser');

        // Register the user via the AuthService
        await AuthService.register(newUser);

        // Guardar en localStorage el nuevo usuario
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Registration successful
        this.success = '¡Registro exitoso! Redirigiendo para completar tu perfil...';

        // Redirect to edit profile after a delay - usar hard refresh para mayor seguridad
        setTimeout(() => {
          window.location.href = '/edit-profile';
        }, 2000);
      } catch (error) {
        console.error('Error en el registro:', error);
        this.error = 'Ocurrió un error durante el registro. Por favor, intenta nuevamente.';
      } finally {
        this.isSubmitting = false;
      }
    },
    goBack() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.signup-card {
  width: 100%;
  max-width: 450px;
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
  margin-bottom: 1.25rem;
}

input[type="text"],
input[type="email"],
input[type="password"] {
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

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group label {
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  flex: 1;
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

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.error-message {
  margin-top: 1rem;
  color: #e53935;
  text-align: center;
  font-size: 0.9rem;
}

.success-message {
  margin-top: 1rem;
  color: #43a047;
  text-align: center;
  font-size: 0.9rem;
}
</style>