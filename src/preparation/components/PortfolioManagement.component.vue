<template>
  <div class="portfolio-management">
    <h2>Gestión de Portafolios</h2>
    
    <!-- Tabla de Portafolios -->
    <pv-card class="mb-4">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h3>Portafolios</h3>
          <pv-button icon="pi pi-plus" label="Nuevo Portafolio" @click="openNewPortfolioDialog" />
        </div>
      </template>
      
      <pv-data-table 
        :value="portfolios" 
        v-model:selection="selectedPortfolios" 
        dataKey="id"
        :paginator="true" 
        :rows="10"
        responsiveLayout="scroll"
        :loading="loading"
        stripedRows
        class="p-datatable-sm"
      >
        <template #empty>No se encontraron portafolios.</template>
        <template #loading>Cargando portafolios...</template>
        
        <pv-column selectionMode="multiple" headerStyle="width: 3rem"></pv-column>
        <pv-column field="id" header="ID" sortable></pv-column>
        <pv-column field="name" header="Nombre" sortable></pv-column>
        <pv-column field="createdAt" header="Fecha Creación" sortable>
          <template #body="slotProps">
            {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
          </template>
        </pv-column>
        <pv-column field="recipeIds" header="# Recetas">
          <template #body="slotProps">
            {{ slotProps.data.recipeIds ? slotProps.data.recipeIds.length : 0 }}
          </template>
        </pv-column>
        <pv-column header="Acciones" style="width: 8rem">
          <template #body="slotProps">
            <div class="flex">
              <pv-button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" @click="editPortfolio(slotProps.data)" />
              <pv-button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="confirmDeletePortfolio(slotProps.data)" />
              <pv-button icon="pi pi-list" class="p-button-text p-button-success p-button-sm ml-2" @click="viewRecipes(slotProps.data)" />
            </div>
          </template>
        </pv-column>
      </pv-data-table>
      
      <template #footer v-if="selectedPortfolios && selectedPortfolios.length > 0">
        <div class="flex justify-content-end">
          <pv-button icon="pi pi-trash" label="Eliminar Seleccionados" severity="danger" @click="confirmDeleteSelectedPortfolios" />
        </div>
      </template>
    </pv-card>
    
    <!-- Diálogo para Crear/Editar Portafolio -->
    <pv-dialog 
      v-model:visible="portfolioDialog" 
      :header="isEditingPortfolio ? 'Editar Portafolio' : 'Nuevo Portafolio'" 
      :modal="true" 
      class="p-fluid"
      :style="{width: '450px'}"
    >
      <div class="field">
        <label for="name">Nombre</label>
        <pv-inputtext id="name" v-model.trim="portfolio.name" required autofocus :class="{'p-invalid': submitted && !portfolio.name}" />
        <small class="p-error" v-if="submitted && !portfolio.name">El nombre es requerido.</small>
      </div>
      
      <template #footer>
        <pv-button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <pv-button label="Guardar" icon="pi pi-check" @click="savePortfolio" />
      </template>
    </pv-dialog>
    
    <!-- Diálogo de Confirmación para Eliminar -->
    <pv-dialog 
      v-model:visible="deletePortfolioDialog" 
      :header="deletePortfolioDialogHeader" 
      :modal="true"
      :style="{width: '450px'}"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="portfolio">{{ deletePortfolioPrompt }}</span>
      </div>
      <template #footer>
        <pv-button label="No" icon="pi pi-times" class="p-button-text" @click="deletePortfolioDialog = false" />
        <pv-button label="Sí" icon="pi pi-check" class="p-button-danger" @click="deletePortfolioConfirmed" />
      </template>
    </pv-dialog>
    
    <!-- Vista de Recetas de un Portafolio -->
    <pv-dialog 
      v-model:visible="recipesDialog" 
      header="Recetas del Portafolio" 
      :modal="true"
      :style="{width: '80vw'}"
    >
      <div v-if="selectedPortfolio">
        <h3>{{ selectedPortfolio.name }}</h3>
        
        <div class="mb-3 flex justify-content-between">
          <pv-button icon="pi pi-plus" label="Añadir Receta" @click="openAddRecipeDialog" />
          <pv-button icon="pi pi-refresh" icon-pos="right" label="Recargar" @click="loadPortfolioRecipes" />
        </div>
        
        <pv-data-table 
          :value="portfolioRecipes" 
          dataKey="id"
          :paginator="true" 
          :rows="5"
          responsiveLayout="scroll"
          :loading="loadingRecipes"
          stripedRows
        >
          <template #empty>No hay recetas en este portafolio.</template>
          <template #loading>Cargando recetas...</template>
          
          <pv-column field="id" header="ID"></pv-column>
          <pv-column field="name" header="Nombre"></pv-column>
          <pv-column header="Imagen">
            <template #body="slotProps">
              <img v-if="slotProps.data.image" :src="slotProps.data.image" :alt="slotProps.data.name" width="50" />
              <span v-else>Sin imagen</span>
            </template>
          </pv-column>
          <pv-column field="preparationTime" header="Tiempo"></pv-column>
          <pv-column header="Acciones">
            <template #body="slotProps">
              <pv-button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removeRecipeFromPortfolio(slotProps.data)" />
            </template>
          </pv-column>
        </pv-data-table>
      </div>
    </pv-dialog>
    
    <!-- Diálogo para Añadir Recetas al Portafolio -->
    <pv-dialog 
      v-model:visible="addRecipeDialog" 
      header="Añadir Receta al Portafolio" 
      :modal="true"
      :style="{width: '80vw'}"
    >
      <div class="mb-3">
        <pv-inputtext v-model="recipeSearchQuery" placeholder="Buscar recetas..." class="w-full" />
      </div>
      
      <pv-data-table 
        :value="availableRecipes" 
        v-model:selection="selectedRecipes"
        dataKey="id"
        :paginator="true" 
        :rows="5"
        responsiveLayout="scroll"
        :loading="loadingAvailableRecipes"
        stripedRows
      >
        <template #empty>No hay recetas disponibles.</template>
        <template #loading>Cargando recetas disponibles...</template>
        
        <pv-column selectionMode="multiple" headerStyle="width: 3rem"></pv-column>
        <pv-column field="id" header="ID"></pv-column>
        <pv-column field="name" header="Nombre"></pv-column>
        <pv-column header="Imagen">
          <template #body="slotProps">
            <img v-if="slotProps.data.image" :src="slotProps.data.image" :alt="slotProps.data.name" width="50" />
            <span v-else>Sin imagen</span>
          </template>
        </pv-column>
        <pv-column field="preparationTime" header="Tiempo"></pv-column>
      </pv-data-table>
      
      <template #footer>
        <pv-button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="addRecipeDialog = false" />
        <pv-button label="Añadir Seleccionadas" icon="pi pi-check" @click="addSelectedRecipesToPortfolio" :disabled="!selectedRecipes.length" />
      </template>
    </pv-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { PortfolioService } from '../services/portfolio.service';
import { RecipeService } from '../services/recipe.service';
import { Portfolio } from '../model/portfolio.entity';

export default {
  name: 'PortfolioManagement',
  
  setup() {
    // Servicios
    const portfolioService = new PortfolioService();
    const recipeService = new RecipeService();
    
    // Estado para portafolios
    const portfolios = ref([]);
    const portfolio = ref(new Portfolio({}));
    const selectedPortfolios = ref([]);
    const portfolioDialog = ref(false);
    const deletePortfolioDialog = ref(false);
    const isEditingPortfolio = ref(false);
    const submitted = ref(false);
    const loading = ref(false);
    
    // Estado para el portafolio seleccionado y sus recetas
    const recipesDialog = ref(false);
    const selectedPortfolio = ref(null);
    const portfolioRecipes = ref([]);
    const loadingRecipes = ref(false);
    
    // Estado para añadir recetas
    const addRecipeDialog = ref(false);
    const availableRecipes = ref([]);
    const selectedRecipes = ref([]);
    const loadingAvailableRecipes = ref(false);
    const recipeSearchQuery = ref('');
    
    // Propiedades computadas
    const deletePortfolioDialogHeader = computed(() => {
      return selectedPortfolios.value.length > 1 
        ? 'Confirmar Eliminación Múltiple' 
        : 'Confirmar Eliminación';
    });
    
    const deletePortfolioPrompt = computed(() => {
      if (selectedPortfolios.value.length > 1) {
        return `¿Estás seguro de que deseas eliminar los ${selectedPortfolios.value.length} portafolios seleccionados?`;
      } else {
        return `¿Estás seguro de que deseas eliminar el portafolio "${portfolio.value.name}"?`;
      }
    });
    
    // Cargar portafolios
    const loadPortfolios = async () => {
      loading.value = true;
      try {
        portfolios.value = await portfolioService.getAllPortfolios();
      } catch (error) {
        console.error('Error al cargar portafolios:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Abrir diálogo para nuevo portafolio
    const openNewPortfolioDialog = () => {
      portfolio.value = new Portfolio({});
      submitted.value = false;
      isEditingPortfolio.value = false;
      portfolioDialog.value = true;
    };
    
    // Editar portafolio
    const editPortfolio = (data) => {
      portfolio.value = { ...data };
      isEditingPortfolio.value = true;
      portfolioDialog.value = true;
    };
    
    // Ocultar diálogo
    const hideDialog = () => {
      portfolioDialog.value = false;
      submitted.value = false;
    };
    
    // Guardar portafolio
    const savePortfolio = async () => {
      submitted.value = true;
      
      if (portfolio.value.name.trim()) {
        loading.value = true;
        
        try {
          if (portfolio.value.id) {
            // Actualizar portafolio existente
            await portfolioService.updatePortfolio(portfolio.value.id, portfolio.value);
          } else {
            // Crear nuevo portafolio
            await portfolioService.createPortfolio(portfolio.value);
          }
          
          await loadPortfolios();
          hideDialog();
        } catch (error) {
          console.error('Error al guardar portafolio:', error);
        } finally {
          loading.value = false;
        }
      }
    };
    
    // Confirmar eliminación de portafolio
    const confirmDeletePortfolio = (data) => {
      portfolio.value = data;
      selectedPortfolios.value = [data];
      deletePortfolioDialog.value = true;
    };
    
    // Confirmar eliminación de portafolios seleccionados
    const confirmDeleteSelectedPortfolios = () => {
      deletePortfolioDialog.value = true;
    };
    
    // Eliminar portafolio confirmado
    const deletePortfolioConfirmed = async () => {
      loading.value = true;
      
      try {
        for (const item of selectedPortfolios.value) {
          await portfolioService.deletePortfolio(item.id);
        }
        
        await loadPortfolios();
        deletePortfolioDialog.value = false;
        selectedPortfolios.value = [];
        
        // Cerrar cualquier otro diálogo abierto
        portfolioDialog.value = false;
        recipesDialog.value = false;
        addRecipeDialog.value = false;
      } catch (error) {
        console.error('Error al eliminar portafolios:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Ver recetas de un portafolio
    const viewRecipes = async (portfolio) => {
      selectedPortfolio.value = portfolio;
      recipesDialog.value = true;
      await loadPortfolioRecipes();
    };
    
    // Cargar recetas de un portafolio
    const loadPortfolioRecipes = async () => {
      if (!selectedPortfolio.value) return;
      
      loadingRecipes.value = true;
      try {
        portfolioRecipes.value = await recipeService.getRecipesByPortfolioId(selectedPortfolio.value.id);
      } catch (error) {
        console.error('Error al cargar recetas del portafolio:', error);
      } finally {
        loadingRecipes.value = false;
      }
    };
    
    // Abrir diálogo para añadir recetas
    const openAddRecipeDialog = async () => {
      loadingAvailableRecipes.value = true;
      selectedRecipes.value = [];
      
      try {
        availableRecipes.value = await recipeService.getRecipesWithoutPortfolio();
        addRecipeDialog.value = true;
      } catch (error) {
        console.error('Error al cargar recetas disponibles:', error);
      } finally {
        loadingAvailableRecipes.value = false;
      }
    };
    
    // Añadir recetas seleccionadas al portafolio
    const addSelectedRecipesToPortfolio = async () => {
      if (!selectedPortfolio.value || !selectedRecipes.value.length) return;
      
      loadingRecipes.value = true;
      
      try {
        for (const recipe of selectedRecipes.value) {
          await portfolioService.addRecipeToPortfolio(selectedPortfolio.value.id, recipe.id);
        }
        
        addRecipeDialog.value = false;
        await loadPortfolioRecipes();
        await loadPortfolios(); // Actualizar lista de portafolios
      } catch (error) {
        console.error('Error al añadir recetas al portafolio:', error);
      } finally {
        loadingRecipes.value = false;
      }
    };
    
    // Eliminar receta de un portafolio
    const removeRecipeFromPortfolio = async (recipe) => {
      if (!selectedPortfolio.value) return;
      
      loadingRecipes.value = true;
      
      try {
        await portfolioService.removeRecipeFromPortfolio(selectedPortfolio.value.id, recipe.id);
        await loadPortfolioRecipes();
        await loadPortfolios(); // Actualizar lista de portafolios
      } catch (error) {
        console.error('Error al eliminar receta del portafolio:', error);
      } finally {
        loadingRecipes.value = false;
      }
    };
    
    // Cargar datos al montar el componente
    onMounted(() => {
      loadPortfolios();
    });
    
    return {
      // Propiedades de portafolios
      portfolios,
      portfolio,
      selectedPortfolios,
      portfolioDialog,
      deletePortfolioDialog,
      isEditingPortfolio,
      submitted,
      loading,
      deletePortfolioDialogHeader,
      deletePortfolioPrompt,
      
      // Métodos de portafolios
      loadPortfolios,
      openNewPortfolioDialog,
      editPortfolio,
      hideDialog,
      savePortfolio,
      confirmDeletePortfolio,
      confirmDeleteSelectedPortfolios,
      deletePortfolioConfirmed,
      
      // Propiedades de recetas del portafolio
      recipesDialog,
      selectedPortfolio,
      portfolioRecipes,
      loadingRecipes,
      viewRecipes,
      loadPortfolioRecipes,
      
      // Propiedades para añadir recetas
      addRecipeDialog,
      availableRecipes,
      selectedRecipes,
      loadingAvailableRecipes,
      recipeSearchQuery,
      openAddRecipeDialog,
      addSelectedRecipesToPortfolio,
      removeRecipeFromPortfolio
    };
  }
};
</script>

<style scoped>
.portfolio-management {
  padding: 1rem;
  background-color: #F8F7F2;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mejoras de visibilidad para inputs */
.pv-inputtext {
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

.p-button-text.p-button-sm {
  background-color: rgba(0,0,0,0.05);
  border-radius: 4px;
}

.p-button-text.p-button-danger.p-button-sm {
  color: #dc2626;
}

.p-button-text.p-button-success.p-button-sm {
  color: #047857;
}
</style> 