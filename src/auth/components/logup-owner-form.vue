<template>
  <div class="logup-form-container">
    <h2>{{ t('LOGUP_OWNER.TITLE') }}</h2>
    <form class="logup-form" @submit.prevent="onSubmit">
      <div class="p-field">
        <label for="name" class="custom-label">{{ t('LOGUP.NAME') }}</label>
        <pv-input-text id="name" v-model="form.name" :class="{ 'p-invalid': isInvalidControl('name') }" class="custom-input" />
      </div>

      <div class="p-field">
        <label for="email" class="custom-label">{{ t('LOGUP.EMAIL') }}</label>
        <pv-input-text id="email" v-model="form.email" type="email" :class="{ 'p-invalid': isInvalidControl('email') }" class="custom-input" />
      </div>

      <div class="p-field">
        <label for="experience" class="custom-label">{{ t('LOGUP.EXPERIENCE') }}</label>
        <pv-dropdown
            id="experience"
            v-model="form.experience"
            :options="experienceOptions"
            option-label="label"
            option-value="value"
            :class="{ 'p-invalid': isInvalidControl('experience') }"
            class="custom-input"
            placeholder=""
        />
      </div>


      <div class="p-field">
        <label for="password" class="custom-label">{{ t('LOGUP.PASSWORD') }}</label>
        <pv-password id="password" v-model="form.password" :class="{ 'p-invalid': isInvalidControl('password') }" class="custom-input" />
      </div>

      <div class="p-field">
        <label for="cafeteriaName" class="custom-label">{{ t('LOGUP.CAFETERIA_NAME') }}</label>
        <pv-input-text id="cafeteriaName" v-model="form.cafeteriaName" :class="{ 'p-invalid': isInvalidControl('cafeteriaName') }" class="custom-input" />
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
  name: 'LogupOwnerForm',
  components: {
    'pv-dropdown': Dropdown,
    'pv-input-text': InputText,
    'pv-password': Password,
    'pv-button': Button
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();

    const form = reactive({
      name: '',
      email: '',
      password: '',
      cafeteriaName: '',
      experience: ''
    });

    const experienceOptions = [
      { label: t('LOGUP.EXPERIENCE_0_3'), value: '0-3' },
      { label: t('LOGUP.EXPERIENCE_4_7'), value: '4-7' },
      { label: t('LOGUP.EXPERIENCE_8_PLUS'), value: '8+' }
    ];

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
      if (
          isInvalidControl('name') ||
          isInvalidControl('email') ||
          isInvalidControl('password') ||
          isInvalidControl('cafeteriaName') ||
          isInvalidControl('experience')
      ) {
        return;
      }

      const { name, email, password, cafeteriaName, experience } = form;
      const newUser = {
        name,
        email,
        password,
        role: 'dueno_cafeteria',
        cafeteriaName,
        experience,
        profilePicture: '',
        paymentMethod: '',
        isFirstLogin: true,
        plan: '',
        hasPlan: false
      };

      userService.register(newUser)
          .then(response => {
            const user = response.data;
            localStorage.setItem('currentUser', JSON.stringify(user));
            router.push({ name: 'logupOwnerSuccess' });
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
.custom-label {
  margin-bottom: 4px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.custom-input {
  width: 100%;
  font-size: 14px;
}



.logup-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 280px;
  width: 100%;
  position: relative;
  z-index: 1;
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
  align-items: stretch;
  width: 100%;
  gap: 14px;
}


.logup-form .p-field {
  width: 100%;
}

/* ===== BOTÓN CON DISEÑO MODERNO - TRES ESTADOS ===== */

.modern-button {
  /* Propiedades base */
  width: 100%;
  padding: 16px 32px;
  border: none;
  border-radius: 50px; /* Bordes completamente redondeados */
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  /* Estado Default - Botón verde oscuro */
  background: linear-gradient(135deg, #4D6443 0%, #5a6b2a 100%);
  color: white;
  box-shadow:
      0 4px 14px rgba(77, 100, 67, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.1);

  /* Efecto de brillo sutil */
  background-size: 200% 200%;
  animation: subtle-shine 3s ease-in-out infinite;
}

/* Estado Hover - Botón blanco con sombra */
.modern-button:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(-2px);
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Estado Active/Focus - Botón blanco con borde verde */
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

/* Animación sutil de brillo */
@keyframes subtle-shine {
  0%, 100% { background-position: 0 50%; }
  50% { background-position: 100% 50%; }
}

/* Efecto de ondas al hacer clic */
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

/* ===== APLICACIÓN EN EL FORMULARIO DE SIGNUP ===== */

.logup-form button {
  /* Botón principal de Sign Up */
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

  /* Estado Default */
  background: linear-gradient(135deg, #4D6443 0%, #5a6b2a 100%);
  color: white;
  box-shadow:
      0 4px 14px rgba(77, 100, 67, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.1);

  background-size: 200% 200%;
  animation: subtle-shine 3s ease-in-out infinite;
}

.logup-form button:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(-2px);
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 10px rgba(0, 0, 0, 0.1);
}

.logup-form button:active,
.logup-form button:focus {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(0);
  outline: none;
  border: 2px solid #4D6443;
  box-shadow:
      0 0 0 3px rgba(77, 100, 67, 0.1),
      0 4px 15px rgba(0, 0, 0, 0.1);
}

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

.logup-form button:active::before {
  width: 300px;
  height: 300px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 480px) {
  .logup-form-container {
    margin: 20px;
    padding: 25px 20px;
    max-width: none;
  }

  .logup-form-container h2 {
    font-size: 24px;
  }

  .logup-form button {
    padding: 14px 28px;
    font-size: 15px;
  }
}

/* Ajusta el campo de contraseña para que ocupe todo el ancho */
::v-deep(.p-password input) {
  width: 100%;
  font-size: 14px;
  padding: 10px;
}

</style>