<template>
  <div class="recipe-list">
    <div class="header">
      <h2>Recetas</h2>
      <pv-button icon="pi pi-plus" label="Nueva Receta" @click="navigateToCreate" />
    </div>
    
    <!-- Tabla de Recetas -->
    <pv-data-table 
      :value="recipes" 
      v-model:selection="selectedRecipes" 
      dataKey="id"
      :paginator="true" 
      :rows="10"
      responsiveLayout="scroll"
      :loading="loading"
      stripedRows
      class="p-datatable-sm"
      :filters="filters"
    >
      <template #empty>No se encontraron recetas.</template>
      <template #loading>Cargando recetas...</template>
      
      <pv-column selectionMode="multiple" headerStyle="width: 3rem"></pv-column>
      <pv-column field="name" header="Nombre" sortable></pv-column>
      <pv-column field="type" header="Tipo" sortable>
        <template #body="slotProps">
          {{ slotProps.data.type === 'extraction' ? 'Extracción' : 'Espresso' }}
        </template>
      </pv-column>
      <pv-column field="preparationTime" header="Tiempo" sortable>
        <template #body="slotProps">
          {{ slotProps.data.preparationTime }} min
        </template>
      </pv-column>
      <pv-column field="portfolioId" header="Portafolio" sortable>
        <template #body="slotProps">
          {{ getPortfolioName(slotProps.data.portfolioId) }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <pv-dropdown 
            v-model="filterModel.value"
            :options="portfolioFilterOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="Seleccionar Portafolio"
            class="p-column-filter"
            :showClear="true"
            @change="filterCallback()"
          >
          </pv-dropdown>
        </template>
      </pv-column>
      <pv-column header="Acciones" style="width: 8rem">
        <template #body="slotProps">
          <div class="flex">
            <pv-button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" @click="navigateToEdit(slotProps.data.id)" />
            <pv-button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="confirmDeleteRecipe(slotProps.data)" />
            <pv-button icon="pi pi-eye" class="p-button-text p-button-success p-button-sm ml-2" @click="navigateToDetail(slotProps.data.id)" />
          </div>
        </template>
      </pv-column>
    </pv-data-table>
    
    <!-- Diálogo de Confirmación para Eliminar -->
    <pv-dialog 
      v-model:visible="deleteRecipeDialog" 
      :header="deleteRecipeDialogHeader" 
      :modal="true"
      :style="{width: '450px'}"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="recipe">{{ deleteRecipePrompt }}</span>
      </div>
      <template #footer>
        <pv-button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRecipeDialog = false" />
        <pv-button label="Sí" icon="pi pi-check" class="p-button-danger" @click="deleteRecipeConfirmed" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RecipeService } from '../services/recipe.service';
import { PortfolioService } from '../services/portfolio.service';
import { Recipe } from '../model/recipe.entity';

const router = useRouter();
const recipeService = new RecipeService();
const portfolioService = new PortfolioService();

// Estados
const recipes = ref([]);
const recipe = ref(new Recipe({}));
const selectedRecipes = ref([]);
const deleteRecipeDialog = ref(false);
const loading = ref(false);
const portfolios = ref([]);

// Filtros
const filters = ref({
  portfolioId: { value: null, matchMode: 'equals' }
});

// Propiedades computadas
const deleteRecipeDialogHeader = computed(() => {
  return selectedRecipes.value.length > 1 
    ? 'Confirmar Eliminación Múltiple' 
    : 'Confirmar Eliminación';
});

const deleteRecipePrompt = computed(() => {
  if (selectedRecipes.value.length > 1) {
    return `¿Estás seguro de que deseas eliminar las ${selectedRecipes.value.length} recetas seleccionadas?`;
  } else {
    return `¿Estás seguro de que deseas eliminar la receta "${recipe.value.name}"?`;
  }
});

const portfolioFilterOptions = computed(() => {
  const options = portfolios.value.map(p => ({ name: p.name, value: p.id }));
  options.unshift({ name: 'Sin Portafolio', value: null });
  return options;
});

// Cargar datos
const loadData = async () => {
  loading.value = true;
  try {
    const [recipesData, portfoliosData] = await Promise.all([
      recipeService.getAllRecipes(),
      portfolioService.getAllPortfolios()
    ]);
    recipes.value = recipesData;
    portfolios.value = portfoliosData;
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    loading.value = false;
  }
};

// Obtener nombre de portafolio
const getPortfolioName = (portfolioId) => {
  if (!portfolioId) return 'Sin Portafolio';
  const portfolio = portfolios.value.find(p => p.id === portfolioId);
  return portfolio ? portfolio.name : 'Desconocido';
};

// Navegación
const navigateToCreate = () => {
  router.push('/recetas/crear');
};

const navigateToEdit = (id) => {
  router.push(`/recetas/editar/${id}`);
};

const navigateToDetail = (id) => {
  router.push(`/recetas/detalle/${id}`);
};

// Confirmar eliminación
const confirmDeleteRecipe = (data) => {
  recipe.value = data;
  selectedRecipes.value = [data];
  deleteRecipeDialog.value = true;
};

// Confirmar eliminación de seleccionados
const confirmDeleteSelectedRecipes = () => {
  deleteRecipeDialog.value = true;
};

// Eliminar receta confirmado
const deleteRecipeConfirmed = async () => {
  loading.value = true;
  
  try {
    for (const item of selectedRecipes.value) {
      await recipeService.deleteRecipe(item.id);
    }
    
    await loadData();
    deleteRecipeDialog.value = false;
    selectedRecipes.value = [];
  } catch (error) {
    console.error('Error al eliminar recetas:', error);
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.recipe-list {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h2 {
  margin: 0;
  color: #5D4037;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.p-dialog .p-dialog-content {
  padding: 2rem;
}

.p-column-filter {
  width: 100%;
}
</style> 