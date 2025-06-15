<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import BaseFormComponent from '../../shared/components/base.form.js';
import userService from '../services/user.service.js';
import { useI18n } from 'vue-i18n';

export default {
  name: 'LoginForm',
  extends: BaseFormComponent,
  methods: {
    isInvalidControl(controlName) {
      const control = this.form[controlName];
      return control?.invalid && control?.touched;
    }
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();

    const form = reactive({
      email: '',
      password: ''
    });

    const validationRules = {
      email: ['required', 'email'],
      password: ['required']
    };

    function onSubmit() {
      if (isFormValid()) {
        userService.login(form.email, form.password)
            .then(user => {
              console.log('Logged in user:', user);
              localStorage.setItem('currentUser', JSON.stringify(user));
              router.push({ name: 'loginSuccess' });
            })
            .catch(error => {
              console.error('Login error:', error);
              // Manejar el error de inicio de sesión, como mostrar un mensaje de error al usuario
            });
      }
    }

    function isFormValid() {
      const isInvalidControl = this.$options.methods.isInvalidControl;
      const emailValid = !isInvalidControl('email');
      const passwordValid = !isInvalidControl('password');
      return emailValid && passwordValid;
    }

    function onRegisterBarista() {
      router.push({ name: 'registerBarista' });
    }

    function onRegisterOwner() {
      router.push({ name: 'registerOwner' });
    }

    return {
      t,
      form,
      validationRules,
      onSubmit,
      onRegisterBarista,
      onRegisterOwner
    };
  }
};
</script>

<template>
  <div class="login-form-container">
    <h2>{{ t('LOGIN.TITLE') }}</h2>
    <form class="login-form" @submit.prevent="onSubmit">
      <div class="p-field">
        <pv-float-label for="email">
          <pv-input-text id="email" v-model="form.email" type="email" :class="{ 'p-invalid': isInvalidControl('email') }" />
          <label>{{ t('LOGIN.EMAIL') }}</label>
        </pv-float-label>
        <small v-if="isInvalidControl('email')" class="p-error">{{ errorMessagesForControl('email') }}</small>
      </div>

      <div class="p-field">
        <pv-float-label for="password">
          <pv-password id="password" v-model="form.password" :class="{ 'p-invalid': isInvalidControl('password') }" />
          <label>{{ t('LOGIN.PASSWORD') }}</label>
        </pv-float-label>
        <small v-if="isInvalidControl('password')" class="p-error">{{ errorMessagesForControl('password') }}</small>
      </div>

      <pv-button type="submit" class="modern-button">{{ t('LOGIN.SUBMIT') }}</pv-button>
    </form>

    <div class="register-buttons">
      <pv-button @click="onRegisterBarista">{{ t('LOGIN.REGISTER_BARISTA') }}</pv-button>
      <pv-button @click="onRegisterOwner">{{ t('LOGIN.REGISTER_OWNER') }}</pv-button>
    </div>
  </div>
</template>

<style scoped>
.login-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.login-form-container h2 {
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
}

.login-form .p-field {
  width: 60%;
}

/* ===== BOTÓN CON DISEÑO MODERNO - TRES ESTADOS ===== */

.modern-button {
  width: 100%;
  padding: 16px 32px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #4D6443 0%, #5a6b2a 100%);
  color: white;
  box-shadow:
      0 4px 14px rgba(77, 100, 67, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.1);
  background-size: 200% 200%;
  animation: subtle-shine 3s ease-in-out infinite;
}

.modern-button:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(-2px);
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 10px rgba(0, 0, 0, 0.1);
}

.modern-button:active,
.modern-button:focus {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(0);
  outline: none;
  border: 2px solid #4D6443;
  box-shadow:
      0 0 0 3px rgba(77, 100, 67, 0.1),
      0 4px 15px rgba(0, 0, 0, 0.1);
}

@keyframes subtle-shine {
  0%, 100% { background-position: 0 50%; }
  50% { background-position: 100% 50%; }
}

.modern-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.modern-button:active::before {
  width: 300px;
  height: 300px;
}

/* ===== BOTONES DE REGISTRO ===== */

.register-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  width: 100%;
}

.register-buttons button {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #4D6443;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #4D6443;
  box-shadow: 0 2px 8px rgba(77, 100, 67, 0.1);
}

.register-buttons button:hover {
  background: linear-gradient(135deg, #4D6443 0%, #5a6b2a 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(77, 100, 67, 0.3);
}

.register-buttons button:active,
.register-buttons button:focus {
  background: #4D6443;
  color: white;
  transform: translateY(0);
  outline: none;
  box-shadow:
      0 0 0 3px rgba(77, 100, 67, 0.2),
      0 2px 8px rgba(77, 100, 67, 0.2);
}

.register-buttons button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.register-buttons button:active::before {
  width: 200px;
  height: 200px;
}

@media (max-width: 480px) {
  .login-form button {
    padding: 14px 28px;
    font-size: 15px;
  }

  .register-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .register-buttons button {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>