import { createRouter, createWebHistory } from 'vue-router'
import PaymentProcess from '../auth/components/PaymentProcess.vue'
import CompletePlanPayment from '../auth/components/CompletePlanPayment.component.vue'
import BaristaDashboard from '../profiles/components/BaristaDashboard.vue'
import CompleteDashboard from '../profiles/components/CompleteDashboard.component.vue'
import CuppingSessionList from '../sensory-evaluation/components/CuppingSessionList.vue'
import CuppingSessionDetail from '../sensory-evaluation/components/CuppingSessionDetail.vue'
import InventoryView from '../administration/InventoryView.vue'
import CostRegisterWizard from '../administration/CostRegisterWizard.vue'
import OwnerDashboard from '../dashboard/OwnerDashboard.vue'
import SuppliersList from '../supply/components/SuppliersList.vue'
import SupplierDetails from '../supply/components/SupplierDetails.vue'
import CoffeeLotsList from '../coffee/components/CoffeeLotsList.vue'
import LotDetails from '../coffee/components/LotDetails.vue'
import RoastingProfilesList from '../roasting/components/RoastingProfilesList.vue'
import RoastingProfileDetails from '../roasting/components/RoastingProfileDetails.vue'
import RoastingProfilesCompare from '../roasting/components/RoastingProfilesCompare.vue'
import DefectList from '../roasting/components/DefectList.vue';
import DefectDetails from '../roasting/components/DefectDetails.vue';
import TastingPattern from '../sensory-evaluation/components/TastingPattern.vue';
import TastingPatternOverview from '../sensory-evaluation/components/TastingPatternOverview.vue'
import Calibration from '../roasting/components/Calibration.vue';
const routes = [
    { path: '/', redirect: '/CompletePayment' },
    { path: '/CompletePayment', name: 'Planes', component: () => import('../auth/components/CompletePlanPayment.component.vue') },
    { path: '/pago-barista', name: 'PagoBarista', component: PaymentProcess },
    { path: '/pago-completo', name: 'PagoCompleto', component: CompletePlanPayment },
    { path: '/dashboard-barista', name: 'DashboardBarista', component: BaristaDashboard },
    { path: '/dashboard', name: 'Dashboard', component: CompleteDashboard },
    { path: '/cata', name: 'CuppingSessions', component: CuppingSessionList },
    { path: '/defects', name: 'defectList', component: DefectList, },
    { path: '/defect/:defectId', name: 'defectDetails',  component: DefectDetails, props: true, },
    { path: '/tasting-pattern', name: 'TastingPattern', component: () => import('../sensory-evaluation/components/TastingPattern.vue')},
    { path: '/tasting-pattern-overview', name: 'TastingPatternOverview', component: () => import('../sensory-evaluation/components/TastingPatternOverview.vue')},
    { path: '/tasting-pattern-overview', name: 'TastingPatternOverview', component: TastingPatternOverview, },
    { path: '/calibration', name: 'Calibration', component: Calibration,},
    { path: '/cata/:id',  name: 'CuppingSessionDetail',  component: CuppingSessionDetail },
    { path: '/comparar-catas/:ids',  name: 'cupping-comparison',  component: () => import('../sensory-evaluation/components/CuppingComparison.vue') },
    { path: '/inventario', name: 'Inventario', component: InventoryView },
    { path: '/costos', name: 'Costos', component: CostRegisterWizard },
    { path: '/recetas', name: 'Recetas', component: () => import('../preparation/components/PortfolioList.component.vue') },
    { path: '/recetas/portfolio/:id', name: 'PortfolioDetail', component: () => import('../preparation/components/PortfolioDetail.component.vue') },
    { path: '/recetas/nueva', name: 'NewRecipe', component: () => import('../preparation/components/RecipeCreate.component.vue') },
    { path: '/recetas/detalle/:id', name: 'RecipeDetail', component: () => import('../preparation/components/RecipeDetail.component.vue') },
    { path: '/recetas/gestion', name: 'RecipeManagement', component: () => import('../preparation/components/PortfolioAndRecipesManagement.component.vue') },
    // Rutas para los demás módulos (pueden estar pendientes de implementación)
    { path: '/correlacion', name: 'Correlacion', component: () => import('../roasting/components/FlavorCorrelation.vue') },
    { path: '/defectos', name: 'Defectos', component: DefectList },
    { path: '/calibracion', name: 'Calibracion', component: Calibration },
    { path: '/proveedores', name: 'Proveedores', component: { template: '<div>Módulo de Proveedores (en desarrollo)</div>' } },
    { path: '/lotes', name: 'Lotes', component: { template: '<div>Módulo de Lotes de Café (en desarrollo)</div>' } },
    { path: '/perfiles', name: 'Perfiles', component: { template: '<div>Módulo de Perfiles de Tuestes (en desarrollo)</div>' } },
    {
      path: '/suppliers',
      name: 'Suppliers',
      component: SuppliersList
    },
    {
      path: '/suppliers/:id',
      name: 'SupplierDetails',
      component: SupplierDetails,
      props: route => ({ supplierId: route.params.id })
    },
    // Coffee Lot routes
    {
      path: '/lots',
      name: 'CoffeeLots',
      component: CoffeeLotsList
    },
    {
      path: '/lots/:id',
      name: 'LotDetails',
      component: LotDetails,
      props: route => ({ lotId: route.params.id })
    },
    // Roasting Profile routes
    {
      path: '/roasting',
      name: 'RoastingProfiles',
      component: RoastingProfilesList
    },
    {
      path: '/roasting/:id',
      name: 'RoastingProfileDetails',
      component: RoastingProfileDetails
    },
    {
      path: '/roasting/compare/:ids',
      name: 'RoastingProfilesCompare',
      component: RoastingProfilesCompare
    }
  ]
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

export default router; 