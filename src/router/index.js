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

// Importamos los componentes de autenticación
import LoginLayout from '../auth/components/login-layout.component.vue';
import SignupBarista from '../auth/components/signup-barista.component.vue';
import SignupOwner from '../auth/components/signup-owner.component.vue';

// Importamos los componentes de dashboard
import BaristaHome from '../dashboard/components/barista-placeholder.component.vue';
import CompletePlaceholder from '../dashboard/components/complete-placeholder.component.vue';

// Importamos el componente de edición de perfil
import EditProfile from '../profile/components/edit-profile.component.vue';

// Para selección de suscripción
import SelectPlan from '../subscription/components/select-plan.component.vue';

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
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginLayout
    },
    {
        path: '/signup-barista',
        name: 'SignupBarista',
        component: SignupBarista
    },
    {
        path: '/signup-owner',
        name: 'SignupOwner',
        component: SignupOwner
    },
    {
        path: '/edit-profile',
        name: 'EditProfile',
        component: EditProfile
    },
    {
        path: '/barista-home',
        name: 'BaristaHome',
        component: BaristaHome
    },
    {
        path: '/owner-home',
        name: 'OwnerHome',
        component: OwnerDashboard
    },
    {
        path: '/complete-dashboard',
        name: 'CompleteDashboard',
        component: CompletePlaceholder
    },
    {
        path: '/select-plan',
        name: 'SelectPlan',
        component: SelectPlan
    },
    // Rutas específicas de gestión de cafetería
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
// Componente para páginas no encontradas
const NotFound = { template: '<div>Página no encontrada</div>' };

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/signup-barista', '/signup-owner'];
    const dashboardPages = ['/barista-home', '/owner-home', '/complete-dashboard'];
    const ownerSpecificPages = ['/suppliers', '/lots', '/roasting']; // Páginas específicas de dueño
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('currentUser');

    // Verificar si la ruta requiere autenticación y no hay usuario logueado
    if (authRequired && !loggedIn) {
        return next('/login');
    }

    if (loggedIn) {
        const user = JSON.parse(loggedIn);
        console.log('Usuario actual:', user);
        console.log('¿Tiene plan?:', user.hasPlan);
        console.log('Plan seleccionado:', user.plan);

        // Verificar si la ruta tiene requisitos de rol específicos
        if (to.meta && to.meta.role && to.meta.role !== user.role) {
            console.log(`Usuario con rol ${user.role} intentando acceder a ruta para ${to.meta.role}`);
            // Redirigir según su rol
            if (user.role === 'barista') {
                return next('/barista-home');
            } else if (user.role === 'dueno_cafeteria') {
                return next('/owner-home');
            }
        }

        // Si el usuario tiene plan completo, redirigir al dashboard completo
        if (user.hasPlan === true && user.plan === 'complete') {
            // Si intenta acceder a dashboards que no le corresponden
            if ((to.path === '/barista-home' || to.path === '/owner-home') && to.path !== '/complete-dashboard') {
                console.log('Usuario con plan completo intentando acceder a otro dashboard');
                return next('/complete-dashboard');
            }
        }
        // Si tiene otro plan pero intenta acceder al dashboard completo
        else if (user.hasPlan === true && user.plan !== 'complete' && to.path === '/complete-dashboard') {
            console.log('Usuario sin plan completo intentando acceder al dashboard completo');
            // Redirigir según su rol
            if (user.role === 'barista') {
                return next('/barista-home');
            } else if (user.role === 'dueno_cafeteria') {
                return next('/owner-home');
            }
        }

        // Si intenta acceder a editar perfil pero ya tiene un perfil completo
        if (to.path === '/edit-profile') {
            const hasCompletedProfile =
                user.hasPlan === true &&
                user.plan &&
                user.paymentMethod;

            if (hasCompletedProfile && from.path !== '/select-plan') {
                console.log('Usuario con perfil completo intentando acceder a editar perfil');
                // Redirigir según el plan
                if (user.plan === 'complete') {
                    return next('/complete-dashboard');
                } else if (user.role === 'barista') {
                    return next('/barista-home');
                } else if (user.role === 'dueno_cafeteria') {
                    return next('/owner-home');
                }
            }
        }

        // Si intenta acceder a dashboards pero no tiene plan seleccionado
        if ((dashboardPages.includes(to.path) || ownerSpecificPages.some(path => to.path.startsWith(path))) && user.hasPlan !== true) {
            console.log('Usuario sin plan intenta acceder al dashboard');
            return next('/select-plan');
        }

        // Si intenta acceder a páginas públicas estando autenticado
        if (publicPages.includes(to.path)) {
            // Si tiene plan, redirigir según su plan
            if (user.hasPlan === true) {
                if (user.plan === 'complete') {
                    return next('/complete-dashboard');
                } else if (user.role === 'barista') {
                    return next('/barista-home');
                } else if (user.role === 'dueno_cafeteria') {
                    return next('/owner-home');
                }
            }
        }
    }

    // Si todo está bien, continuar
    next();
});
export default router;