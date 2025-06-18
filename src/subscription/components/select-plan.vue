<template>
  <component :is="showDashboardHeader ? 'HeaderBar' : 'HeaderBarInit'" />

  <header-bar-init color="primary">
    <HeaderBarInit />
  </header-bar-init>

  <div class="background">
    <div class="container">
      <div class="plans-grid">
        <!-- Plan Barista -->
        <div class="plan-card">
          <h2 class="plan-title">{{ $t('PLANS.BARISTA.TITLE') }}</h2>
          <div class="plan-details">
            <p class="plan-price">$9 / {{ $t('PLANS.MONTH') }}</p>
            <ul class="plan-features" v-if="baristaFeatures.length">
              <li v-for="(feature, index) in baristaFeatures" :key="index">• {{ feature }}</li>
            </ul>
          </div>
          <button class="plan-button" @click="selectPlan('barista')">
            {{ $t('PLANS.BARISTA.BUTTON') }}
          </button>
        </div>

        <!-- Plan Owner -->
        <div class="plan-card">
          <h2 class="plan-title">{{ $t('PLANS.OWNER.TITLE') }}</h2>
          <div class="plan-details">
            <p class="plan-price">$9 / {{ $t('PLANS.MONTH') }}</p>
            <ul class="plan-features" v-if="ownerFeatures.length">
              <li v-for="(feature, index) in ownerFeatures" :key="index">• {{ feature }}</li>
            </ul>
          </div>
          <button class="plan-button" @click="selectPlan('owner')">
            {{ $t('PLANS.OWNER.BUTTON') }}
          </button>
        </div>

        <!-- Plan Full -->
        <div class="plan-card">
          <h2 class="plan-title">{{ $t('PLANS.FULL.TITLE') }}</h2>
          <div class="plan-details">
            <p class="plan-price">$15 / {{ $t('PLANS.MONTH') }}</p>
            <ul class="plan-features" v-if="fullFeatures.length">
              <li v-for="(feature, index) in fullFeatures" :key="index">• {{ feature }}</li>
            </ul>
          </div>
          <button class="plan-button" @click="selectPlan('complete')">
            {{ $t('PLANS.FULL.BUTTON') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ToolbarPlan from './ToolbarPlanComponent.vue'
import UserService from '../../auth/services/user.service.js'
import HeaderBarInit from "../../public/components/headerBarInit.vue";

const { t, tm, locale } = useI18n();
const router = useRouter();

const baristaFeatures = ref([]);
const ownerFeatures = ref([]);
const fullFeatures = ref([]);


function loadTranslations() {
  baristaFeatures.value = tm('PLANS.BARISTA.FEATURES');
  ownerFeatures.value = tm('PLANS.OWNER.FEATURES');
  fullFeatures.value = tm('PLANS.FULL.FEATURES');


}


onMounted(() => {
  loadTranslations();
});

watch(locale, () => {
  loadTranslations();
});

function selectPlan(type) {
  const selected = {
    type,
    name: '',
    translationKey: '',
    price: 0,
    features: []
  };

  switch (type) {
    case 'barista':
      selected.translationKey = 'PLANS.BARISTA.TITLE';
      selected.name = t(selected.translationKey);
      selected.price = 9;
      selected.features = baristaFeatures.value;
      break;
    case 'owner':
      selected.translationKey = 'PLANS.OWNER.TITLE';
      selected.name = t(selected.translationKey);
      selected.price = 9;
      selected.features = ownerFeatures.value;
      break;
    case 'complete':
      selected.translationKey = 'PLANS.FULL.TITLE';
      selected.name = t(selected.translationKey);
      selected.price = 15;
      selected.features = fullFeatures.value;
      break;
  }

  localStorage.setItem('selectedPlan', JSON.stringify(selected));

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (!currentUser.id) {
    console.error('El usuario actual no tiene un ID definido.');
    return;
  }

  const updatedUser = {
    ...currentUser,
    plan: type,
    hasPlan: false
  };

  console.log('currentUser:', currentUser);

  UserService.updateProfile(currentUser.id, updatedUser)
      .then(user => {
        console.log('[SelectPlan] Usuario actualizado:', user); // ✅ deberías ver el usuario actualizado

        // Guardar en localStorage para que router.beforeEach lo detecte correctamente
        localStorage.setItem('currentUser', JSON.stringify(user));

        router.push({ name: 'confirm-plan' });
      })
      .catch(err => {
        console.error('Update profile error:', err);
      });

}



</script>

<style scoped>
.background {
  background-image: url('../../../public/fondo_planes.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
}

.plans-grid {
  background-color: #F8F7F2;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .plans-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.plan-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.plan-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.plan-details {
  background-color: #C68F61;
  border-radius: 0.25rem;
  padding: 1rem;
  color: white;
  margin-bottom: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.plan-price {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.plan-features {
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
  flex-grow: 1;
}

.plan-features li {
  margin-bottom: 0.25rem;
}

.plan-button {
  background-color: #414535;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: auto;
}

.plan-button:hover {
  background-color: #333228;
}
</style>
