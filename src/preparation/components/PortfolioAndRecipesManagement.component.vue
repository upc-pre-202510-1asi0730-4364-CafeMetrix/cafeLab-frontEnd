<template>
  <div class="portfolio-recipes-management">
    <div class="header">
      <h1>Gestión de Portafolios y Recetas</h1>
      <p>Administra tus portafolios y recetas usando MockAPI como backend</p>
    </div>
    
    <pv-tabview>
      <pv-tabpanel header="Portafolios">
        <portfolio-management />
      </pv-tabpanel>
      <pv-tabpanel header="Recetas">
        <recipe-management />
      </pv-tabpanel>
    </pv-tabview>
    
    <pv-toast position="bottom-right" />
  </div>
</template>

<script>
import PortfolioManagement from './PortfolioManagement.component.vue';
import RecipeManagement from './RecipeManagement.component.vue';

export default {
  name: 'PortfolioAndRecipesManagement',
  components: {
    PortfolioManagement,
    RecipeManagement
  }
};
</script>

<style scoped>
.portfolio-recipes-management {
  padding: 1rem;
  background-color: #F8F7F2;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #5D4037;
  margin-bottom: 0.5rem;
}

.header p {
  color: #795548;
  font-style: italic;
}

/* Mejoras de visibilidad para PrimeVue */
::v-deep .p-tabview .p-tabview-nav {
  background-color: #f8f9fa;
}

::v-deep .p-tabview .p-tabview-nav li .p-tabview-nav-link {
  color: #333;
}

::v-deep .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background-color: #fff;
  color: #3C4B3A;
  border-color: #3C4B3A;
}

::v-deep .p-tabview-panels {
  background-color: #fff;
}

::v-deep .p-toast-message {
  background-color: #fff;
  color: #333;
}
</style> 