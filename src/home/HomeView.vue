<script setup>
import { useI18n } from 'vue-i18n';
import Header from '../shared/components/Header.vue';

const { t } = useI18n();
</script>

<template>
  <div class="home-container">
    <Header />

    <div class="home-content">
      <h1 class="home-title">{{ t('supply.menu.home') }} - Café Lab</h1>

      <div class="sections-container">
        <div class="section-card" @click="$router.push('/suppliers')">
          <h2>{{ t('supply.title') }}</h2>
          <p>Gestiona tus proveedores de café</p>
          <div class="card-button">
            <span>Ver proveedores</span>
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>

        <div class="section-card" @click="$router.push('/lots')">
          <h2>{{ t('coffee.title') }}</h2>
          <p>Administra tus lotes de café</p>
          <div class="card-button">
            <span>Ver lotes</span>
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>

        <div class="section-card" @click="$router.push('/roasting')">
          <h2>{{ t('roasting.title') }}</h2>
          <p>Gestiona tus perfiles de tueste</p>
          <div class="card-button">
            <span>Ver perfiles</span>
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f1e8;
}

.home-content {
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-title {
  color: #4a634b;
  margin-bottom: 2rem;
  text-align: center;
}

.sections-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
}

.section-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.section-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.section-card h2 {
  color: #4a634b;
  margin-top: 0;
}

.section-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.card-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a634b;
  font-weight: bold;
}

@media (max-width: 768px) {
  .sections-container {
    flex-direction: column;
    align-items: center;
  }

  .section-card {
    max-width: 100%;
  }
}
</style>