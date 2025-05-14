<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import RoastingProfileService from '../service/RoastingProfileService';
import Header from '../../shared/components/Header.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => route.path.includes('edit'));
const profileId = isEditMode.value ? Number(route.params.id) : null;

const profile = ref({
  id: null,
  name: '',
  type: '',
  altitude: '',
  supplier: '',
  isFavorite: false
});

// Opciones para selects
const typeOptions = ['Tueste claro', 'Tueste medio', 'Tueste oscuro'];
const altitudeOptions = ['Baja', 'Media', 'Alta'];
const supplierOptions = ['Chanchamayo', 'Villa Rica', 'Cusco', 'Importado'];

onMounted(() => {
  if (isEditMode.value && profileId) {
    const existingProfile = RoastingProfileService.getProfileById(profileId);
    if (existingProfile) {
      profile.value = { ...existingProfile };
    } else {
      router.push('/roasting');
    }
  }
});

const saveProfile = () => {
  if (isEditMode.value) {
    RoastingProfileService.updateProfile(profile.value);
  } else {
    RoastingProfileService.addProfile(profile.value);
  }
  router.push('/roasting');
};

const goBack = () => {
  router.push('/roasting');
};
</script>

<template>
  <div class="form-container">
    <Header />

    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-item clickable">{{ t('roasting.home') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <router-link to="/roasting" class="breadcrumb-item clickable">{{ t('roasting.title') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">
        {{ isEditMode ? t('roasting.editForm.title') : t('roasting.registerForm.title') }}
      </span>
    </div>

    <div class="content-container">
      <div class="form-card">
        <h2>{{ isEditMode ? t('roasting.editForm.title') : t('roasting.registerForm.title') }}</h2>

        <div class="form-section">
          <h3>{{ t('roasting.registerForm.information') }}</h3>

          <div class="form-grid">
            <div class="form-group">
              <label>{{ t('roasting.registerForm.name') }}</label>
              <input type="text" v-model="profile.name" />
            </div>

            <div class="form-group">
              <label>{{ t('roasting.registerForm.type') }}</label>
              <select v-model="profile.type">
                <option value="">{{ t('roasting.filter.allTypes') }}</option>
                <option v-for="type in typeOptions" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t('roasting.registerForm.altitude') }}</label>
              <select v-model="profile.altitude">
                <option value="">{{ t('roasting.filter.allAltitudes') }}</option>
                <option v-for="altitude in altitudeOptions" :key="altitude" :value="altitude">
                  {{ altitude }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t('roasting.registerForm.supplier') }}</label>
              <select v-model="profile.supplier">
                <option value="">{{ t('roasting.filter.allSuppliers') }}</option>
                <option v-for="supplier in supplierOptions" :key="supplier" :value="supplier">
                  {{ supplier }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="back-button" @click="goBack">{{ t('roasting.registerForm.back') }}</button>
          <button class="save-button" @click="saveProfile">
            {{ isEditMode ? t('roasting.editForm.update') : t('roasting.registerForm.register') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background-color: #f5f1e8;
}

.breadcrumbs {
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
}

.breadcrumb-item.clickable {
  cursor: pointer;
  color: #4a634b;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #888;
}

.content-container {
  padding: 0 2rem 2rem;
  flex-grow: 1;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.form-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
}

.form-card h2 {
  color: #4a634b;
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  color: #5a7a6f;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-group input, .form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.back-button {
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: #4a634b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>