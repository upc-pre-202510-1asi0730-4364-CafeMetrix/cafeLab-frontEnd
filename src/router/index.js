import { createRouter, createWebHistory } from 'vue-router'
import PaymentProcess from '../auth/components/PaymentProcess.vue'
import CompletePlanPayment from '../auth/components/CompletePlanPayment.component.vue'
import BaristaDashboard from '../profiles/components/BaristaDashboard.vue'
import CompleteDashboard from '../profiles/components/CompleteDashboard.component.vue'
import CuppingSessionList from '../sensory-evaluation/components/CuppingSessionList.vue'
import CuppingSessionDetail from '../sensory-evaluation/components/CuppingSessionDetail.vue'
import InventoryView from '../administration/InventoryView.vue'
import CostRegisterWizard from '../administration/CostRegisterWizard.vue'

const routes = [
    { path: '/', redirect: '/planes' },
    { path: '/planes', name: 'Planes', component: () => import('../auth/components/CompletePlanPayment.component.vue') },
    { path: '/pago-barista', name: 'PagoBarista', component: PaymentProcess },
    { path: '/pago-completo', name: 'PagoCompleto', component: CompletePlanPayment },
    { path: '/dashboard-barista', name: 'DashboardBarista', component: BaristaDashboard },
    { path: '/dashboard', name: 'Dashboard', component: CompleteDashboard },
    { path: '/cata', name: 'CuppingSessions', component: CuppingSessionList },
    {
        path: '/cata/:id',
        name: 'CuppingSessionDetail',
        component: CuppingSessionDetail
    },
    {
        path: '/comparar-catas/:ids',
        name: 'cupping-comparison',
        component: () => import('../sensory-evaluation/components/CuppingComparison.vue')
    },
    { path: '/inventario', name: 'Inventario', component: InventoryView },
    { path: '/costos', name: 'Costos', component: CostRegisterWizard },
    { path: '/recetas', name: 'Recetas', component: () => import('../preparation/components/PortfolioList.component.vue') },
    { path: '/recetas/portfolio/:id', name: 'PortfolioDetail', component: () => import('../preparation/components/PortfolioDetail.component.vue') },
    { path: '/recetas/nueva', name: 'NewRecipe', component: () => import('../preparation/components/RecipeCreate.component.vue') },
    { path: '/recetas/detalle/:id', name: 'RecipeDetail', component: () => import('../preparation/components/RecipeDetail.component.vue') },
    { path: '/recetas/gestion', name: 'RecipeManagement', component: () => import('../preparation/components/PortfolioAndRecipesManagement.component.vue') },
    // Rutas para los demás módulos (pueden estar pendientes de implementación)
    { path: '/proveedores', name: 'Proveedores', component: { template: '<div>Módulo de Proveedores (en desarrollo)</div>' } },
    { path: '/lotes', name: 'Lotes', component: { template: '<div>Módulo de Lotes de Café (en desarrollo)</div>' } },
    { path: '/perfiles', name: 'Perfiles', component: { template: '<div>Módulo de Perfiles de Tuestes (en desarrollo)</div>' } },
    { path: '/defectos', name: 'Defectos', component: { template: '<div>Módulo de Librería de Defectos (en desarrollo)</div>' } },
    { path: '/correlacion', name: 'Correlacion', component: { template: '<div>Módulo de Correlación Tueste-Sabor (en desarrollo)</div>' } },
    { path: '/calibracion', name: 'Calibracion', component: { template: '<div>Módulo de Calibración de Molienda (en desarrollo)</div>' } },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
