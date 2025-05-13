<template>
  <div class="signup-page">
    <div class="signup-content">
      <div class="form-container">
        <div class="signup-card">
          <h2>{{ $t('signup.title_owner') }}</h2>

          <form @submit.prevent="signup">
            <div class="form-grid">
              <!-- Primera columna -->
              <div class="form-column">
                <div class="form-group">
                  <pv-input-text
                      type="text"
                      v-model="user.name"
                      :placeholder="$t('signup.fullname')"
                      required
                      class="w-full"
                  />
                </div>

                <div class="form-group">
                  <pv-input-text
                      type="email"
                      v-model="user.email"
                      :placeholder="$t('signup.email')"
                      required
                      class="w-full"
                  />
                </div>

                <div class="form-group">
                  <pv-password
                      v-model="user.password"
                      :placeholder="$t('signup.password')"
                      :feedback="false"
                      toggleMask
                      required
                      class="w-full"
                  />
                </div>
              </div>

              <!-- Segunda columna -->
              <div class="form-column">
                <div class="form-group">
                  <pv-input-text
                      type="text"
                      v-model="user.cafeteriaName"
                      :placeholder="$t('signup.cafe_name')"
                      required
                      class="w-full"
                  />
                </div>

                <div class="form-group">
                  <pv-input-text
                      type="text"
                      v-model="user.experience"
                      :placeholder="$t('signup.owner_experience')"
                      class="w-full"
                  />
                </div>

                <div class="form-group">
                  <pv-password
                      v-model="confirmPassword"
                      :placeholder="$t('signup.confirm_password')"
                      :feedback="false"
                      toggleMask
                      required
                      class="w-full"
                  />
                </div>
              </div>
            </div>

            <div class="form-group checkbox-group">
              <div class="checkbox-container">
                <input
                    type="checkbox"
                    id="terms"
                    v-model="termsAccepted"
                    required
                    class="custom-checkbox"
                />
                <label for="terms">{{ $t('signup.accept_terms') }}</label>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="goBack">{{ $t('common.back') }}</button>
              <button
                  type="submit"
                  class="custom-button"
                  :disabled="!isFormValid || isSubmitting"
              >
                {{ isSubmitting ? $t('signup.registering') : $t('signup.register') }}
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
          this.error = this.$t('signup.error_password_mismatch');
          this.isSubmitting = false;
          return;
        }

        // Check if email already exists
        const existingUser = await AuthService.findUserByEmail(this.user.email);
        if (existingUser) {
          this.error = this.$t('signup.error_email_exists');
          this.isSubmitting = false;
          return;
        }

        // Create a new user with the User entity
        const newUser = new User(this.user);

        // Generar un ID único
        newUser.id = 'o_' + Date.now();

        // Marcar como primer inicio de sesión
        newUser.isFirstLogin = true;

        console.log('Registrando dueño de cafetería:', newUser);

        // Limpiar localStorage antes de guardar nuevo usuario
        localStorage.removeItem('currentUser');

        // Register the user via the AuthService
        await AuthService.register(newUser);

        // Guardar en localStorage el nuevo usuario
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Registration successful
        this.success = this.$t('signup.success_message');

        // Redirect to edit profile after a delay - usar hard refresh para mayor seguridad
        setTimeout(() => {
          window.location.href = '/edit-profile';
        }, 2000);
      } catch (error) {
        console.error('Error en el registro:', error);
        this.error = this.$t('signup.error_registration');
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
.signup-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.signup-content {
  display: flex;
  width: 100%;
  height: 100%;
}

.form-container {
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 80px 80px 20px 20px;
  position: relative;
}

/* Aplicar imagen de fondo a la derecha */
.signup-page::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background-image: url('/signupowner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.signup-card {
  width: 100%;
  max-width: 600px; /* Aumentado para acomodar dos columnas */
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

/* Grid de dos columnas */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  grid-column: span 2; /* Hacer que ocupe ambas columnas */
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Estilos personalizados para el checkbox */
.custom-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  margin-right: 10px;
}

.custom-checkbox:checked {
  background-color: #4c4c3d;
  border-color: #4c4c3d;
}

.custom-checkbox:checked::before {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}

.checkbox-group label {
  font-size: 0.95rem;
  color: #444;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 200px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-button {
  background-color: #4c4c3d;
  color: white;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.custom-button:hover {
  background-color: white;
  color: #4D6443;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

/* Responsive - en pantallas pequeñas, ajustar layout */
@media (max-width: 768px) {
  .form-container {
    width: 100%;
    justify-content: center;
    padding: 80px 20px 20px;
  }

  .signup-page::after {
    display: none;
  }

  /* Cambiar a una columna en móviles */
  .form-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>