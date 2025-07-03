<template>
  <div class="logup-form-container">
    <h2>{{ t('LOGUP_BARISTA.TITLE') }}</h2>
    <form class="logup-form" @submit.prevent="onSubmit">
      <div class="p-field">
        <pv-float-label for="name">
          <pv-input-text id="name" v-model="form.name" :class="{ 'p-invalid': isInvalidControl('name') }" />
          <label>{{ t('LOGUP.NAME') }}</label>
        </pv-float-label>
      </div>

      <div class="p-field">
        <pv-float-label for="email">
          <pv-input-text id="email" v-model="form.email" type="email" :class="{ 'p-invalid': isInvalidControl('email') }" />
          <label>{{ t('LOGUP.EMAIL') }}</label>
        </pv-float-label>
      </div>

      <div class="p-field">
        <label class="experience-label">{{ t('LOGUP.EXPERIENCEB') }}</label>
        <div class="experience-buttons">
          <button
              type="button"
              :class="['experience-btn', { selected: form.experience === 'beginner' }]"
              @click="form.experience = 'beginner'"
          >
            {{ t('LOGUP.EXPERIENCE_BEGINNER') }}
          </button>

          <button
              type="button"
              :class="['experience-btn', { selected: form.experience === 'intermediate' }]"
              @click="form.experience = 'intermediate'"
          >
            {{ t('LOGUP.EXPERIENCE_INTERMEDIATE') }}
          </button>

          <button
              type="button"
              :class="['experience-btn', { selected: form.experience === 'advanced' }]"
              @click="form.experience = 'advanced'"
          >
            {{ t('LOGUP.EXPERIENCE_ADVANCED') }}
          </button>
        </div>
      </div>

      <div class="p-field">
        <pv-float-label for="password">
          <pv-password id="password" v-model="form.password" :class="{ 'p-invalid': isInvalidControl('password') }" />
          <label>{{ t('LOGUP.PASSWORD') }}</label>
        </pv-float-label>
      </div>

      <pv-button type="submit" class="modern-button">{{ t('LOGUP.SUBMIT') }}</pv-button>
    </form>
  </div>
</template>

<script>

import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import userService from '../services/user.service.js';

export default {
  name: 'LogupBaristaForm',
  components: {
    'pv-dropdown': Dropdown,
    'pv-input-text': InputText,
    'pv-password': Password,
    'pv-button': Button
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();

    const experienceOptions = [
      { label: t('LOGUP.EXPERIENCE_BEGINNER'), value: 'beginner' },
      { label: t('LOGUP.EXPERIENCE_INTERMEDIATE'), value: 'intermediate' },
      { label: t('LOGUP.EXPERIENCE_ADVANCED'), value: 'advanced' }
    ];


    const form = reactive({
      name: '',
      email: '',
      password: '',
      experience: ''
    });

    // Validación simple por ahora
    const isInvalidControl = (controlName) => {
      return !form[controlName] || form[controlName].length === 0;
    };

    const errorMessagesForControl = (controlName) => {
      if (isInvalidControl(controlName)) {
        return t('LOGUP.REQUIRED');
      }
      return '';
    };

    const onSubmit = () => {
      // Validación simple
      if (isInvalidControl('name') || isInvalidControl('email') || isInvalidControl('password') || isInvalidControl('experience')) {
        // Opcional: mostrar errores aquí
        return;
      }

      const { name, email, password, experience } = form;
      const newUser = {
        name,
        email,
        password,
        experience,
        role: 'barista',
        cafeteriaName: '',
        profilePicture: '',
        paymentMethod: '',
        isFirstLogin: true,
        plan: '',
        hasPlan: false
      };

      userService.register(newUser)
          .then(response => {
            // Aquí sí es .data (respuesta Axios)
            const user = response.data;
            localStorage.setItem('currentUser', JSON.stringify(user));
            router.push({ name: 'logupBaristaSuccess' });
          })
          .catch(error => {
            console.error('Registration error:', error);
          });
    };

    return {
      t,
      form,
      isInvalidControl,
      errorMessagesForControl,
      onSubmit,
      experienceOptions
    };

  }
};
</script>

<style scoped>
.logup-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 520px; /* Un poco más ancho para evitar que los botones choquen */
  width: 100%;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.logup-form-container h2 {
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.logup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 26px;
}

.logup-form .p-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.p-field pv-float-label,
.p-field pv-float-label > *,
.p-field pv-input-text,
.p-field pv-password,
.p-field pv-dropdown {
  width: 100%;
}

.p-field :deep(.p-dropdown) {
  width: 100%;
}


.p-dropdown {
  width: 100%;
}

/* ===== BOTÓN MODERNO ===== */
.modern-button,
.logup-form button {
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
  margin-top: 20px;
  background: linear-gradient(135deg, #4D6443 0%, #5a6b2a 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(77, 100, 67, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1);
  background-size: 200% 200%;
  animation: subtle-shine 3s ease-in-out infinite;
}

.modern-button:hover,
.logup-form button:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modern-button:active,
.modern-button:focus,
.logup-form button:active,
.logup-form button:focus {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(0);
  outline: none;
  border: 2px solid #4D6443;
  box-shadow: 0 0 0 3px rgba(77, 100, 67, 0.1), 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modern-button::before,
.logup-form button::before {
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

.modern-button:active::before,
.logup-form button:active::before {
  width: 300px;
  height: 300px;
}

@keyframes subtle-shine {
  0%, 100% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (max-width: 480px) {
  .modern-button,
  .logup-form button {
    padding: 14px 28px;
    font-size: 15px;
  }
}

.experience-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.experience-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap; /* Para que en pantallas pequeñas los botones no se deformen */
}

.experience-btn {
  flex: 1;
  padding: 13px 16px;
  min-width: 96px;
  max-width: 180px;
  border: 2px solid #4D6443;
  border-radius: 10px;
  background: #fff;
  color: #4D6443;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  box-shadow: none;
}

.experience-btn.selected,
.experience-btn.selected:hover,
.experience-btn.selected:focus,
.experience-btn.selected:active {
  background-color: #618985 !important;
  color: #fff !important;
  border: 2px solid #414535 !important;
  box-shadow: 0 4px 16px rgba(65, 137, 133, 0.25);
  transform: scale(1.04);
  z-index: 2;
}

@media (max-width: 480px) {
  .experience-btn {
    padding: 10px;
    font-size: 14px;
  }
}

</style>
