<script>
import { ref, onMounted, computed } from 'vue';
import { RecipeService } from '../services/recipe.service';
import { PortfolioService } from '../services/portfolio.service';
import { Recipe } from '../model/recipe.entity';

export default {
  name: 'RecipeManagement',
  
  setup() {
    // Servicios
    const recipeService = new RecipeService();
    const portfolioService = new PortfolioService();
    
    // Estado para recetas
    const recipes = ref([]);
    const recipe = ref(new Recipe({}));
    const selectedRecipes = ref([]);
    const recipeDialog = ref(false);
    const deleteRecipeDialog = ref(false);
    const isEditingRecipe = ref(false);
    const submitted = ref(false);
    const loading = ref(false);
    
    // Estado para filtrado
    const filters = ref({
      portfolioId: { value: null, matchMode: 'equals' }
    });
    
    // Estado para portafolios
    const portfolios = ref([]);
    const selectedPortfolioId = ref(null);
    const assignPortfolioDialog = ref(false);
    
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
    
    // Cargar recetas
    const loadRecipes = async () => {
      loading.value = true;
      try {
        recipes.value = await recipeService.getAllRecipes();
      } catch (error) {
        console.error('Error al cargar recetas:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Cargar portafolios
    const loadPortfolios = async () => {
      try {
        portfolios.value = await portfolioService.getAllPortfolios();
      } catch (error) {
        console.error('Error al cargar portafolios:', error);
      }
    };
    
    // Obtener nombre de portafolio por ID
    const getPortfolioName = (portfolioId) => {
      const portfolio = portfolios.value.find(p => p.id === portfolioId);
      return portfolio ? portfolio.name : 'Desconocido';
    };
    
    // Abrir diálogo para nueva receta
    const openNewRecipeDialog = () => {
      recipe.value = new Recipe({
        ingredients: [],
        steps: []
      });
      submitted.value = false;
      isEditingRecipe.value = false;
      recipeDialog.value = true;
    };
    
    // Editar receta
    const editRecipe = (data) => {
      recipe.value = { ...data };
      // Asegurarse de que ingredients y steps son arrays
      if (!recipe.value.ingredients) recipe.value.ingredients = [];
      if (!recipe.value.steps) recipe.value.steps = [];
      
      isEditingRecipe.value = true;
      recipeDialog.value = true;
    };
    
    // Ocultar diálogo
    const hideDialog = () => {
      recipeDialog.value = false;
      submitted.value = false;
    };
    
    // Añadir ingrediente
    const addIngredient = () => {
      recipe.value.ingredients.push({ name: '', quantity: '', unit: '' });
    };
    
    // Eliminar ingrediente
    const removeIngredient = (index) => {
      recipe.value.ingredients.splice(index, 1);
    };
    
    // Añadir paso
    const addStep = () => {
      recipe.value.steps.push('');
    };
    
    // Eliminar paso
    const removeStep = (index) => {
      recipe.value.steps.splice(index, 1);
    };
    
    // Guardar receta
    const saveRecipe = async () => {
      submitted.value = true;
      
      if (recipe.value.name.trim()) {
        loading.value = true;
        
        try {
          if (recipe.value.id) {
            // Actualizar receta existente
            await recipeService.updateRecipe(recipe.value.id, recipe.value);
          } else {
            // Crear nueva receta
            await recipeService.createRecipe(recipe.value);
          }
          
          await loadRecipes();
          hideDialog();
        } catch (error) {
          console.error('Error al guardar receta:', error);
        } finally {
          loading.value = false;
        }
      }
    };
    
    // Confirmar eliminación de receta
    const confirmDeleteRecipe = (data) => {
      recipe.value = data;
      selectedRecipes.value = [data];
      deleteRecipeDialog.value = true;
    };
    
    // Confirmar eliminación de recetas seleccionadas
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
        
        await loadRecipes();
        deleteRecipeDialog.value = false;
        selectedRecipes.value = [];
        
        // Cerrar cualquier otro diálogo abierto
        recipeDialog.value = false;
        assignPortfolioDialog.value = false;
      } catch (error) {
        console.error('Error al eliminar recetas:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Abrir diálogo para asignar a portafolio
    const openAssignPortfolioDialog = (data) => {
      recipe.value = data;
      selectedPortfolioId.value = null;
      assignPortfolioDialog.value = true;
    };
    
    // Asignar a portafolio
    const assignToPortfolio = async () => {
      if (!recipe.value.id || selectedPortfolioId.value === undefined) return;
      
      loading.value = true;
      
      try {
        await recipeService.assignToPortfolio(recipe.value.id, selectedPortfolioId.value);
        assignPortfolioDialog.value = false;
        await loadRecipes();
      } catch (error) {
        console.error('Error al asignar receta a portafolio:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Desasignar de portafolio
    const unassignFromPortfolio = async (data) => {
      loading.value = true;
      
      try {
        await recipeService.removeFromPortfolio(data.id);
        await loadRecipes();
      } catch (error) {
        console.error('Error al desasignar receta de portafolio:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Cargar datos al montar el componente
    onMounted(() => {
      loadRecipes();
      loadPortfolios();
    });
    
    return {
      // Propiedades de recetas
      recipes,
      recipe,
      selectedRecipes,
      recipeDialog,
      deleteRecipeDialog,
      isEditingRecipe,
      submitted,
      loading,
      filters,
      deleteRecipeDialogHeader,
      deleteRecipePrompt,
      
      // Métodos de recetas
      loadRecipes,
      openNewRecipeDialog,
      editRecipe,
      hideDialog,
      addIngredient,
      removeIngredient,
      addStep,
      removeStep,
      saveRecipe,
      confirmDeleteRecipe,
      confirmDeleteSelectedRecipes,
      deleteRecipeConfirmed,
      
      // Propiedades de portafolios
      portfolios,
      portfolioFilterOptions,
      selectedPortfolioId,
      assignPortfolioDialog,
      
      // Métodos de portafolios
      getPortfolioName,
      loadPortfolios,
      openAssignPortfolioDialog,
      assignToPortfolio,
      unassignFromPortfolio
    };
  }
};
</script>

<template>
  <div class="recipe-management">
    <h2>Gestión de Recetas</h2>
    
    <!-- Tabla de Recetas -->
    <pv-card class="mb-4">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h3>Recetas</h3>
          <pv-button icon="pi pi-plus" label="Nueva Receta" @click="openNewRecipeDialog" />
        </div>
      </template>
      
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
        <pv-column field="id" header="ID" sortable></pv-column>
        <pv-column field="name" header="Nombre" sortable></pv-column>
        <pv-column header="Imagen" style="width: 100px">
          <template #body="slotProps">
            <img v-if="slotProps.data.image" :src="slotProps.data.image" :alt="slotProps.data.name" width="80" />
            <span v-else>Sin imagen</span>
          </template>
        </pv-column>
        <pv-column field="preparationTime" header="Tiempo" sortable></pv-column>
        <pv-column field="portfolioId" header="Portafolio" sortable>
          <template #filter="{filterModel, filterCallback}">
            <pv-dropdown
              v-model="filterModel.value"
              :options="portfolioFilterOptions"
              optionLabel="name"
              optionValue="value"
              placeholder="Todos"
              class="p-column-filter"
              @change="filterCallback()"
            />
          </template>
          <template #body="slotProps">
            <span v-if="slotProps.data.portfolioId">{{ getPortfolioName(slotProps.data.portfolioId) }}</span>
            <span v-else>Sin asignar</span>
          </template>
        </pv-column>
        <pv-column header="Acciones" style="width: 8rem">
          <template #body="slotProps">
            <div class="flex">
              <pv-button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" @click="editRecipe(slotProps.data)" />
              <pv-button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="confirmDeleteRecipe(slotProps.data)" />
              <pv-button v-if="!slotProps.data.portfolioId" icon="pi pi-link" class="p-button-text p-button-success p-button-sm ml-2" @click="openAssignPortfolioDialog(slotProps.data)" />
              <pv-button v-else icon="pi pi-link-alt" class="p-button-text p-button-info p-button-sm ml-2" @click="unassignFromPortfolio(slotProps.data)" />
            </div>
          </template>
        </pv-column>
      </pv-data-table>
      
      <template #footer v-if="selectedRecipes && selectedRecipes.length > 0">
        <div class="flex justify-content-end">
          <pv-button icon="pi pi-trash" label="Eliminar Seleccionadas" severity="danger" @click="confirmDeleteSelectedRecipes" />
        </div>
      </template>
    </pv-card>
    
    <!-- Diálogo para Crear/Editar Receta -->
    <pv-dialog 
      v-model:visible="recipeDialog" 
      :header="isEditingRecipe ? 'Editar Receta' : 'Nueva Receta'" 
      :modal="true" 
      class="p-fluid"
      :style="{width: '650px'}"
    >
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="name">Nombre</label>
            <pv-inputtext id="name" v-model.trim="recipe.name" required autofocus :class="{'p-invalid': submitted && !recipe.name}" />
            <small class="p-error" v-if="submitted && !recipe.name">El nombre es requerido.</small>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="preparationTime">Tiempo de Preparación</label>
            <pv-inputtext id="preparationTime" v-model.trim="recipe.preparationTime" placeholder="5 min" />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="image">Imagen (URL)</label>
            <pv-inputtext id="image" v-model.trim="recipe.image" placeholder="https://..." />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label>Ingredientes</label>
            <div v-for="(ingredient, i) in recipe.ingredients" :key="i" class="flex align-items-center mb-2">
              <pv-inputtext v-model="ingredient.name" placeholder="Nombre" />
              <pv-inputtext v-model="ingredient.quantity" placeholder="Cantidad" style="max-width: 80px;" />
              <pv-inputtext v-model="ingredient.unit" placeholder="Unidad" style="max-width: 80px;" />
              <pv-button icon="pi pi-trash" class="p-button-danger" @click="removeIngredient(i)" />
            </div>
            <div class="flex justify-content-end">
              <pv-button label="Añadir Ingrediente" icon="pi pi-plus" class="p-button-sm p-button-outlined mt-2" @click="addIngredient" />
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label>Pasos</label>
            <div v-for="(step, i) in recipe.steps" :key="i" class="flex align-items-center mb-2">
              <pv-inputtext v-model="recipe.steps[i]" placeholder="Instrucción" />
              <pv-button icon="pi pi-trash" class="p-button-danger" @click="removeStep(i)" />
            </div>
            <div class="flex justify-content-end">
              <pv-button label="Añadir Paso" icon="pi pi-plus" class="p-button-sm p-button-outlined mt-2" @click="addStep" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <pv-button label="Guardar" icon="pi pi-check" @click="saveRecipe" />
      </template>
    </pv-dialog>
    
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
    
    <!-- Diálogo para Asignar Portafolio -->
    <pv-dialog 
      v-model:visible="assignPortfolioDialog" 
      header="Asignar a Portafolio" 
      :modal="true"
      :style="{width: '450px'}"
    >
      <div class="field">
        <label for="portfolioId">Seleccionar Portafolio</label>
        <pv-dropdown id="portfolioId" v-model="selectedPortfolioId" :options="portfolios" optionLabel="name" optionValue="id" placeholder="Seleccionar Portafolio" class="w-full" />
      </div>
      
      <template #footer>
        <pv-button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="assignPortfolioDialog = false" />
        <pv-button label="Asignar" icon="pi pi-check" @click="assignToPortfolio" :disabled="!selectedPortfolioId" />
      </template>
    </pv-dialog>
  </div>
</template>



<style scoped>
.recipe-management {
  padding: 1rem;
  background-color: #F8F7F2;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mejoras de visibilidad para inputs */
.pv-inputtext, 
.pv-dropdown, 
.pv-inputgroup-addon {
  color: #333 !important;
  background-color: #fff !important;
  border-color: #ddd;
}

.pv-dropdown .p-dropdown-label {
  color: #333 !important;
  background-color: #fff !important;
}

/* Estilo para modal */
.pv-dialog .p-dialog-content {
  background-color: #fff !important;
}

.pv-dialog .p-dialog-header {
  background-color: #f8f9fa;
  color: #333;
}

.field label {
  color: #333;
  font-weight: 500;
}

/* Mejorar visibilidad de botones */
.p-button-text {
  background-color: rgba(0,0,0,0.05);
  border-radius: 4px;
}

.p-button-text.p-button-danger {
  color: #dc2626;
}

.p-button-text.p-button-success {
  color: #047857;
}

.p-button-text.p-button-info {
  color: #0284c7;
}

.p-tag {
  color: white !important;
}

.p-tag.p-tag-success {
  background-color: #059669;
}

.p-tag.p-tag-warning {
  background-color: #d97706;
}
</style> 