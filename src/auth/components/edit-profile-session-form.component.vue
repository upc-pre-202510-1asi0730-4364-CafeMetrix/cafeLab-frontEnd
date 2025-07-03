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

      <div class="button-group">
        <pv-button class="modern-button" type="submit">
          {{ t('EDIT_PROFILE.SAVE_CHANGES') }}
        </pv-button>
        <pv-button class="modern-button secondary" type="button" @click="goToChangePlan">
          {{ t('EDIT_PROFILE.CHANGE_PLAN') }}
        </pv-button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import userService from '../services/user.service.js';
import { useAuthService} from "../services/authService.js";

const authService = useAuthService({})

export default {
  name: 'EditProfileSessionForm',
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
      if (!form[controlName] || form[controlName].length === 0) return true;
      if (controlName === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return true;
      return false;
    };

    const errorMessagesForControl = (controlName) => {
      if (!form[controlName] || form[controlName].length === 0) return t('EDIT_PROFILE.REQUIRED');
      if (controlName === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('EDIT_PROFILE.INVALID_EMAIL');
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
          .then(() => {
            return userService.getUserById(currentUser.value.id);
          })
          .then(response => {
            const freshUser = response.data;
            localStorage.setItem('currentUser', JSON.stringify(freshUser));
            authService.setCurrentUser(freshUser);
            redirectAfterUpdate(freshUser);
          })
          .catch(error => {
            console.error('Update profile error:', error);
          });
    };

    function redirectAfterUpdate(updatedUser) {
      if (!updatedUser) {
        console.error('redirectAfterUpdate: updatedUser es undefined');
        return router.push({ name: 'login' });
      }
      if (!updatedUser.hasPlan) {
        return router.push({ name: 'select-plan' });
      }
      // Si ya tiene plan, quedarse en la página de perfil y mostrar mensaje de éxito
      // Aquí podrías mostrar un mensaje de éxito con un estado reactivo si lo deseas
      // Por ahora, simplemente no redirige
      return;
    }

    // Ir a cambiar plan
    const goToChangePlan = () => {
      router.push({ name: 'select-plan-change' });
    };

    return {
      t,
      form,
      currentUser,
      paymentMethodOptions,
      isInvalidControl,
      errorMessagesForControl,
      onSubmit,
      goToChangePlan
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
.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
.secondary {
  background: #618985;
  color: #fff;
}
</style> 