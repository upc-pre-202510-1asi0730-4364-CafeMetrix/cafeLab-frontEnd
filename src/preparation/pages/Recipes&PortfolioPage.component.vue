<template>
  <div class="recipes-portfolio-page">
    <HeaderBar />
    <BreadcrumbNavigation :items="breadcrumbItems" />
    
    <div class="content-container">
      <div class="search-container">
        <div class="search-box">
          <i class="pi pi-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="$t('recipes.search')" 
            @input="filterItems"
            class="search-input"
          />
        </div>
      </div>

      <PortfolioList :searchQuery="searchQuery" />
      <RecipeList :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PortfolioList from '../components/PortfolioList.component.vue';
import RecipeList from '../components/RecipeList.component.vue';
import BreadcrumbNavigation from '../../shared/components/BreadcrumbNavigation.component.vue';
import HeaderBar from "../../public/components/headerBar.vue";

// Datos para el breadcrumb
const breadcrumbItems = [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Recetas', path: '/recetas' }
];

// Estado para la búsqueda
const searchQuery = ref('');

const filterItems = () => {
  // Esta función se llama cuando el usuario escribe en el campo de búsqueda
  // El filtrado se maneja en cada componente individual mediante props
};
</script>

<style scoped>
.recipes-portfolio-page {
  min-height: calc(100vh - 70px);
  background-color: #F8F7F2;
  padding: 2rem;
  margin-top: 70px;
}

.content-container {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  margin: 20px 0;
  width: 100%;
}

.search-box {
  position: relative;
  width: 300px;
  background: white;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1rem;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  background: transparent;
  transition: all 0.2s ease;
  color: #2f2f2f;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(60, 75, 58, 0.1);
}

.search-input::placeholder {
  color: #4c4c4c;
}
</style>
