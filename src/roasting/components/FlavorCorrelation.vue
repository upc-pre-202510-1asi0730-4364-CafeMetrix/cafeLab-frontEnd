<template>
  <div class="correlation-page">
    <CuppingHeader />
    <div class="correlation-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-container">
        <div class="breadcrumb">
          <span @click="navigateToHome" class="breadcrumb-link">Inicio</span> > <strong>Correlación Tueste-Sabor</strong>
        </div>
      </div>

      <h1 class="page-title">Correlación entre Perfiles de Tueste y Sabores</h1>
      
      <div class="coming-soon">
        <p>Este módulo está en desarrollo. Próximamente podrás:</p>
        <ul>
          <li>Visualizar correlaciones entre perfiles de tueste y sabores resultantes</li>
          <li>Analizar tendencias sobre cómo afectan los tuestes a las notas de sabor</li>
          <li>Predecir perfiles de sabor basados en parámetros de tueste</li>
          <li>Optimizar tus tuestes para conseguir sabores específicos</li>
        </ul>
        <p>¡Estamos trabajando para ti!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import CuppingHeader from '../../shared/components/CuppingHeader.component.vue';

export default {
  name: 'FlavorCorrelation',
  components: {
    CuppingHeader
  },
  setup() {
    const router = useRouter();

    const navigateToHome = () => {
      router.push('/dashboard');
    };

    return {
      navigateToHome
    };
  }
};
</script>

<style scoped>
.correlation-page {
  min-height: 100vh;
  background-color: #F8F7F2;
}

.correlation-container {
  padding: 100px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 16px;
  color: #414535;
}

.breadcrumb-link {
  cursor: pointer;
  color: #3C4B3A;
  text-decoration: underline;
}

.page-title {
  font-size: 28px;
  color: #414535;
  margin-bottom: 30px;
}

.coming-soon {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-top: 20px;
}

.coming-soon p {
  font-size: 18px;
  color: #414535;
}

.coming-soon ul {
  margin: 20px 0;
  padding-left: 20px;
}

.coming-soon li {
  margin-bottom: 10px;
  color: #414535;
}
</style> 