<template>
  <div class="edit-profile-form-container">
    <h2>{{ t('EDIT_PROFILE.TITLE') }}</h2>
    <form class="edit-profile-form" @submit.prevent="onSubmit">
      <div class="p-field">
        <label for="name" class="field-label">{{ t('EDIT_PROFILE.NAME') }}</label>
        <pv-input-text id="name" v-model="form.name" :class="{ 'p-invalid': isInvalidControl('name') }" />
        <small v-if="isInvalidControl('name')" class="p-error">{{ errorMessagesForControl('name') }}</small>
      </div>

      <div class="p-field">
        <label for="email" class="field-label">{{ t('EDIT_PROFILE.EMAIL') }}</label>
        <pv-input-text id="email" v-model="form.email" type="email" :class="{ 'p-invalid': isInvalidControl('email') }" />
        <small v-if="isInvalidControl('email')" class="p-error">{{ errorMessagesForControl('email') }}</small>
      </div>

      <div class="p-field" v-if="currentUser?.role === 'dueno_cafeteria'">
        <label for="cafeteriaName" class="field-label">{{ t('EDIT_PROFILE.CAFETERIA_NAME') }}</label>
        <pv-input-text id="cafeteriaName" v-model="form.cafeteriaName" :class="{ 'p-invalid': isInvalidControl('cafeteriaName') }" />
        <small v-if="isInvalidControl('cafeteriaName')" class="p-error">{{ errorMessagesForControl('cafeteriaName') }}</small>
      </div>

      <div class="p-field">
        <label for="experience" class="field-label">{{ t('EDIT_PROFILE.EXPERIENCE') }}</label>
        <pv-input-text id="experience" v-model="form.experience" :class="{ 'p-invalid': isInvalidControl('experience') }" />
        <small v-if="isInvalidControl('experience')" class="p-error">{{ errorMessagesForControl('experience') }}</small>
      </div>

      <div class="p-field">
        <label for="paymentMethod" class="field-label">{{ t('EDIT_PROFILE.PAYMENT_METHOD') }}</label>
        <pv-select-button
            id="paymentMethod"
            v-model="form.paymentMethod"
            :options="paymentMethodOptions"
            optionLabel="label"
            optionValue="value"
            :class="{ 'p-invalid': isInvalidControl('paymentMethod') }"
        />
        <small v-if="isInvalidControl('paymentMethod')" class="p-error">
          {{ errorMessagesForControl('paymentMethod') }}
        </small>
      </div>

      <pv-button type="submit" class="modern-button">{{ t('EDIT_PROFILE.SUBMIT') }}</pv-button>
    </form>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import userService from '../services/user.service.js';

export default {
  name: 'EditProfileForm',
  setup() {
    const { t } = useI18n();
    const router = useRouter();

    // Opciones de pago
    const paymentMethodOptions = [
      { value: 'visa', label: t('EDIT_PROFILE.VISA') },
      { value: 'mastercard', label: t('EDIT_PROFILE.MASTERCARD') }
    ];

    // Cargar usuario actual de localStorage
    const currentUser = computed(() => {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    });

    // Formulario reactivo
    const form = reactive({
      name: '',
      email: '',
      cafeteriaName: '',
      experience: '',
      paymentMethod: ''
    });

    // Rellena los campos con los datos actuales del usuario al cargar
    onMounted(() => {
      if (currentUser.value) {
        form.name = currentUser.value.name || '';
        form.email = currentUser.value.email || '';
        form.cafeteriaName = currentUser.value.cafeteriaName || '';
        form.experience = currentUser.value.experience || '';
        form.paymentMethod = currentUser.value.paymentMethod || '';
      }
    });

    // Validación simple
    const isInvalidControl = (controlName) => {
      // Simple: campo vacío o, para el email, formato inválido
      if (!form[controlName] || form[controlName].length === 0) return true;
      if (controlName === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return true;
      return false;
    };

    const errorMessagesForControl = (controlName) => {
      if (!form[controlName] || form[controlName].length === 0) return t('EDIT_PROFILE.REQUIRED');
      if (controlName === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('EDIT_PROFILE.EMAIL_INVALID');
      return '';
    };

    // Guardar cambios
    const onSubmit = () => {
      if (
          isInvalidControl('name') ||
          isInvalidControl('email') ||
          isInvalidControl('experience') ||
          isInvalidControl('paymentMethod') ||
          (currentUser.value?.role === 'dueno_cafeteria' && isInvalidControl('cafeteriaName'))
      ) {
        // No hace nada si hay errores
        return;
      }

      const { name, email, cafeteriaName, experience, paymentMethod } = form;
      const updatedUser = {
        ...currentUser.value,
        name,
        email,
        cafeteriaName: cafeteriaName || '',
        experience,
        paymentMethod,
        isFirstLogin: false
      };

      userService.updateProfile(currentUser.value.id, updatedUser)
          .then(response => {
            const updated = response.data;
            localStorage.setItem('currentUser', JSON.stringify(updated));
            redirectAfterUpdate(updated);
          })
          .catch(error => {
            console.error('Update profile error:', error);
          });
    };

    function redirectAfterUpdate(updatedUser) {
      if (updatedUser?.hasPlan) {
        switch (updatedUser.plan) {
          case 'barista':
            router.push({ name: 'baristaDashboard' });
            break;
          case 'admin':
            router.push({ name: 'ownerDashboard' });
            break;
          case 'complete':
            router.push({ name: 'completeDashboard' });
            break;
          default:
            router.push({ name: '/' });
            break;
        }
      } else {
        router.push({ name: 'selectPlan' });
      }
    }

    return {
      t,
      form,
      currentUser,
      paymentMethodOptions,
      isInvalidControl,
      errorMessagesForControl,
      onSubmit
    };
  }
};
</script>


<style scoped>
.field-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.edit-profile-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}


.edit-profile-form-container h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 500;
  color: #333;
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.edit-profile-form .p-field {
  width: 100%;
  margin-bottom: 20px;
}

.edit-profile-form button {
  width: auto;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  background: linear-gradient(135deg, #4a5d23 0%, #5a6b2a 100%);
  color: white;
  box-shadow:
      0 4px 14px rgba(74, 93, 35, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.1);

  background-size: 200% 200%;
  animation: subtle-shine 3s ease-in-out infinite;
}

.edit-profile-form button:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4a5d23;
  transform: translateY(-2px);
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 10px rgba(0, 0, 0, 0.1);
}

.edit-profile-form button:active,
.edit-profile-form button:focus {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #4a5d23;
  transform: translateY(0);
  outline: none;
  border: 2px solid #4a5d23;
  box-shadow:
      0 0 0 3px rgba(74, 93, 35, 0.1),
      0 4px 15px rgba(0, 0, 0, 0.1);
}

.edit-profile-form button::before {
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

.edit-profile-form button:active::before {
  width: 300px;
  height: 300px;
}

</style>