<script>
import { useRouter } from 'vue-router'
import { useAuthService } from '../../auth/services/authService.js'
import { useI18n } from 'vue-i18n'

export default {
  props: {
    items: {
      type: Array,
      required: true,
      validator: (items) => {
        return items.every((item) => item.label && (item.path !== undefined));
      }
    }
  },
  setup() {
    const router = useRouter()
    const auth = useAuthService()
    const { t } = useI18n()

    function handleBreadcrumbClick(item) {
      // Si es el elemento "Inicio" y la ruta es /dashboard, usar la lógica dinámica
      if ((item.label === 'Inicio' || item.label === 'Home') && item.path === '/dashboard') {
        goToDashboard()
        return
      }
      
      // Para otros elementos, usar navegación normal
      router.push(item.path)
    }

    function goToDashboard() {
      if (!auth.isLoggedIn()) {
        return router.push({ name: 'login' })
      }

      const user = auth.getCurrentUser()
      const dashboardRoutes = {
        barista: 'baristaDashboard',
        owner: 'ownerDashboard',
        complete: 'completeDashboard'
      }

      const plan = user.plan?.toLowerCase()
      const targetRoute = dashboardRoutes[plan] || 'baristaDashboard'

      router.push({ name: targetRoute })
    }

    // Función para traducir las etiquetas del breadcrumb
    function translateBreadcrumbLabel(label) {
      const labelMap = {
        'Inicio': t('breadcrumb.home'),
        'Home': t('breadcrumb.home'),
        'Recetas': t('breadcrumb.recipes'),
        'Recipes': t('breadcrumb.recipes'),
        'Portafolios': t('breadcrumb.portfolios'),
        'Portfolios': t('breadcrumb.portfolios'),
        'Crear Receta': t('breadcrumb.createRecipe'),
        'Create Recipe': t('breadcrumb.createRecipe'),
        'Editar Receta': t('breadcrumb.editRecipe'),
        'Edit Recipe': t('breadcrumb.editRecipe'),
        'Detalle de Receta': t('breadcrumb.recipeDetail'),
        'Recipe Detail': t('breadcrumb.recipeDetail'),
        'Inventario': t('breadcrumb.inventory'),
        'Inventory': t('breadcrumb.inventory')
      }
      
      return labelMap[label] || label
    }

    return {
      handleBreadcrumbClick,
      translateBreadcrumbLabel
    }
  }
};
</script>

<template>
  <div class="breadcrumb">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <template v-if="index < items.length - 1">
          <a href="#" @click.prevent="handleBreadcrumbClick(item)">{{ translateBreadcrumbLabel(item.label) }}</a>
          <span class="separator">&gt;</span>
        </template>
        <template v-else>
          <span class="current">{{ translateBreadcrumbLabel(item.label) }}</span>
        </template>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.breadcrumb {
  padding: 1rem 2rem;
  background-color: transparent;
  margin-bottom: 1rem;
}

.breadcrumb ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
}

.breadcrumb li {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  color: #3C4B3A;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}

.breadcrumb a:hover {
  color: #c38757;
  text-decoration: underline;
}

.breadcrumb .current {
  color: #666;
  font-weight: 500;
}

.separator {
  margin: 0 8px;
  color: #999;
  font-weight: 500;
}
</style> 