<template>
  <div class="dashboard">
    <HeaderBar />
    
    <div class="dashboard-container">
      <h1 class="dashboard-title">{{ t('dashboard.ownerPlan') }} - Café Lab</h1>
      
      <div class="modules-grid">
        <!-- Módulos activos -->
        <div class="module-card" @click="navigateTo('suppliers')">
          <div class="icon-container">
            <img src="https://cdn-icons-png.flaticon.com/512/72/72109.png" alt="Proveedores">
          </div>
          <h3>{{ t('supply.title') }}</h3>
        </div>

        <div class="module-card" @click="navigateTo('lots')">
          <div class="icon-container">
            <img src="https://cdn-icons-png.flaticon.com/512/809/809532.png" alt="Lotes de Café">
          </div>
          <h3>{{ t('dashboard.modules.coffeeLots') }}</h3>
        </div>

        <div class="module-card" @click="navigateTo('roasting')">
          <div class="icon-container">
            <img src="https://static.thenounproject.com/png/3538949-200.png" alt="Perfiles de Tuestes">
          </div>
          <h3>{{ t('dashboard.modules.roastProfiles') }}</h3>
        </div>

        <div class="module-card" @click="navigateTo('inventory')">
          <div class="icon-container">
            <img src="https://cdn-icons-png.freepik.com/512/2211/2211640.png" alt="Inventario">
          </div>
          <h3>{{ t('dashboard.modules.inventory') }}</h3>
        </div>

        <div class="module-card" @click="navigateTo('costs')">
          <div class="icon-container">
            <img src="https://static.thenounproject.com/png/1814435-200.png" alt="Gestión de Costos">
          </div>
          <h3>{{ t('dashboard.modules.costs') }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import HeaderBar from '../../public/components/headerBar.vue'

const router = useRouter();
const { t } = useI18n();

// Mapa de rutas para cada módulo
const routeMap = {
  suppliers: '/suppliers',
  lots: '/lots',
  roasting: '/roasting',
  inventory: '/inventario',
  costs: '/costos-lote'
};

/**
 * Navega a la ruta correspondiente al módulo seleccionado
 * @param {string} module - El módulo seleccionado
 */
const navigateTo = (module) => {
  if (routeMap[module]) {
    router.push(routeMap[module]);
  } else {
    console.error(`Ruta no encontrada para el módulo: ${module}`);
  }
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f1e8;
  display: flex;
  flex-direction: column;
  padding-top: 72px; /* Espacio para el header fijo */
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  flex-grow: 1;
}

.dashboard-title {
  font-size: 32px;
  color: #4a634b;
  margin-bottom: 40px;
  text-align: center;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 20px;
}

.module-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  border-color: #4a634b;
}

.icon-container {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f1e8;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.module-card:hover .icon-container {
  background: #4a634b;
}

.module-card:hover .icon-container img {
  filter: brightness(0) invert(1);
}

.icon-container img {
  width: 35px;
  height: 35px;
  transition: all 0.3s ease;
}

.module-card h3 {
  font-size: 16px;
  color: #4a634b;
  margin: 0;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .modules-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 1rem;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 10px;
  }

  .module-card {
    padding: 20px;
  }

  .icon-container {
    width: 60px;
    height: 60px;
  }

  .icon-container img {
    width: 30px;
    height: 30px;
  }
}
</style> 