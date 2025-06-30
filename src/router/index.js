import { createRouter, createWebHistory } from 'vue-router';
import { useAuthService } from "../auth/services/authService.js";

import SelectPlan from "../subscription/components/select-plan.vue";
import ConfirmPlan from "../subscription/components/confirm-plan.vue";
import SupplierPage from "../supply/page/SupplierPage.vue";

import InventoryView from '../administration/pages/InventoryView.vue'
import CostRegisterWizard from '../administration/pages/CostRegisterWizard.vue'
import CoffeeLots from '../coffee-lot/pages/LotsPage.vue'

import DefectList from '../roasting/components/DefectList.vue';
import DefectDetails from '../roasting/components/DefectDetails.vue';
import Calibration from '../roasting/components/Calibration.vue';
import RoastingPage from '../roasting/pages/RoastingPage.vue'
import DefectPage from '../roasting/pages/DefectPage.vue'
import CalibrationPage from '../roasting/pages/CalibrationPage.vue'

// Importar componentes de roast-profiles
import RoastProfilePage from '../roast-profiles/page/RoastProfilePage.vue';
import RoastProfileComparison from '../roast-profiles/components/RoastProfileComparison.vue';
import CuppingSessionList from '../sensory-evaluation/components/CuppingSessionList.vue';
import CuppingSessionDetail from '../sensory-evaluation/components/CuppingSessionDetail.vue';
import BaristaCuppingSessions from '../sensory-evaluation/BaristaCuppingSessions.vue';


const LoginPage = () => import('../auth/pages/login-page.component.vue');
const LoginSuccessPage = () => import('../auth/pages/login-success-page.component.vue');
const LogupBaristaPage = () => import('../auth/pages/logup-barista-page.component.vue');
const LogupBaristaSuccessPage = () => import('../auth/pages/logup-barista-success-page.component.vue');
const LogupOwnerPage = () => import('../auth/pages/logup-owner-page.component.vue');
const LogupOwnerSuccessPage = () => import('../auth/pages/logup-owner-success-page.component.vue');
const EditProfilePage = () => import('../auth/pages/edit-profile-page.component.vue');
const BaristaDashboard = () => import('../profiles/components/BaristaDashboard.vue');
const OwnerDashboard = () => import('../profiles/components/OwnerDashboard.vue');
const CompleteDashboard = () => import('../profiles/components/CompleteDashboard.component.vue');
const PageNotFound = () => import('../public/pages/page-not-found.component.vue');
const ContactUsPage = () => import('../public/pages/ContactUsPage.vue');



const routes = [
    { path: '/',                        name: 'default',             redirect: { name: 'login' } },
    { path: '/login',                   name: 'login',               component: LoginPage,               meta: { title: 'Login' } },
    { path: '/login/success',           name: 'loginSuccess',        component: LoginSuccessPage,        meta: { title: 'Login Success' } },
    { path: '/register/barista',        name: 'registerBarista',     component: LogupBaristaPage,        meta: { title: 'Register Barista' } },
    { path: '/logup/barista/success',   name: 'logupBaristaSuccess', component: LogupBaristaSuccessPage, meta: { title: 'Barista Registration Success' } },
    { path: '/register/owner',          name: 'registerOwner',       component: LogupOwnerPage,          meta: { title: 'Register Owner' } },
    { path: '/logup/owner/success',     name: 'logupOwnerSuccess',   component: LogupOwnerSuccessPage,   meta: { title: 'Owner Registration Success' } },
    { path: '/contact',                 name: 'contactUs',           component: ContactUsPage,           meta: { title: 'Contact Us' } },
    { path: '/edit-profile',            name: 'editProfile',         component: EditProfilePage,         meta: { title: 'Edit Profile' } },
    { path: '/select-plan', name: 'select-plan', component: SelectPlan },
    { path: '/confirm-plan', name: 'confirm-plan', component: ConfirmPlan },
    { path: '/dashboard/barista',       name: 'baristaDashboard',    component: BaristaDashboard,        meta: { title: 'Barista Dashboard' } },


    { path: '/defects', name: 'defectList', component: DefectList, },
    { path: '/defect/:defectId', name: 'defectDetails',  component: DefectDetails, props: true, },
    { path: '/calibration', name: 'Calibration', component: Calibration,},
    { path: '/roasting', component: RoastingPage },
    { path: '/roasting/defects', component: DefectPage },
    { path: '/roasting/calibrations', component: CalibrationPage },


    { path: '/cata', name: 'CuppingSessions', component: CuppingSessionList, meta: { title: 'Sesiones de Cata' } },
    { path: '/cata/:id', name: 'CuppingSessionDetail', component: CuppingSessionDetail, props: true, meta: { title: 'Detalle de Cata' } },
    { path: '/comparar-catas/:ids', name: 'cupping-comparison', component: () => import('../sensory-evaluation/components/CuppingComparison.vue'), props: true, meta: { title: 'Comparar Catas' } },

    // Rutas para roast-profiles
    { path: '/roast-profiles', name: 'roastProfiles', component: RoastProfilePage, meta: { title: 'Perfiles de Tostado' } },
    { path: '/roast-profiles/compare', name: 'roastProfileComparison', component: RoastProfileComparison, meta: { title: 'Comparar Perfiles' } },

    { path: '/dashboard/owner',         name: 'ownerDashboard',      component: OwnerDashboard,          meta: { title: 'Owner Dashboard' } },
    { path: '/suppliers',name: 'suppliers', component: SupplierPage },
    { path: '/lots', name: 'lots', component: CoffeeLots},
    { path: '/inventario', name: 'inventario', component: InventoryView },
    { path: '/costos-lote', name: 'costos-lote', component: CostRegisterWizard },

    { path: '/dashboard/complete',      name: 'completeDashboard',   component: CompleteDashboard,       meta: { title: 'Complete Dashboard' } },

    { path: '/recetas', name: 'Recetas', component: () => import('../preparation/components/PortfolioList.component.vue') },
    { path: '/recetas/portfolio/:id', name: 'PortfolioDetail', component: () => import('../preparation/components/PortfolioDetail.component.vue') },
    { path: '/recetas/nueva', name: 'NewRecipe', component: () => import('../preparation/components/RecipeCreate.component.vue') },
    { path: '/recetas/detalle/:id', name: 'RecipeDetail', component: () => import('../preparation/components/RecipeDetail.component.vue') },
    // Rutas para los demás módulos (pueden estar pendientes de implementación)

    { path: '/cata-barista', name: 'BaristaCuppingSessions', component: BaristaCuppingSessions, meta: { title: 'Sesiones de Cata Barista' } },

    { path: '/:pathMatch(.*)*',         name: 'notFound',            component: PageNotFound,            meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthService();
    const user = auth.getCurrentUser();

    let baseTitle = 'Café Lab';
    document.title = `${baseTitle} | ${to.meta.title}`;

    const publicPages = ['login', 'registerBarista', 'registerOwner', 'logupBaristaSuccess', 'logupOwnerSuccess'];

    if (!user && !publicPages.includes(to.name)) {
        return next({ name: 'login' }); // Redirige si no ha iniciado sesión
    }

    // Si está en confirm-plan y ya tiene hasPlan=true, redirige al dashboard adecuado
    if (user && user.hasPlan && to.name === 'confirm-plan') {
        let dashboardRoute;

        switch (user.plan) {
            case 'owner':
                dashboardRoute = 'ownerDashboard';
                break;
            case 'barista':
                dashboardRoute = 'baristaDashboard';
                break;
            case 'complete':
                dashboardRoute = 'completeDashboard';
                break;
            default:
                dashboardRoute = 'defaultDashboard'; // fallback, opcional
        }

        return next({ name: dashboardRoute });
    }


    return next();
});

export default router;