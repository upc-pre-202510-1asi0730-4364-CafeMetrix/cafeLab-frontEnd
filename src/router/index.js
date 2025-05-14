import { createRouter, createWebHistory } from 'vue-router';

// Importamos los componentes de autenticación
import LoginLayout from '../auth/components/login-layout.component.vue';
import SignupBarista from '../auth/components/signup-barista.component.vue';
import SignupOwner from '../auth/components/signup-owner.component.vue';

// Importamos los componentes de dashboard
import BaristaHome from '../dashboard/components/barista-placeholder.component.vue';
import CompletePlaceholder from '../dashboard/components/complete-placeholder.component.vue';
import OwnerDashboard from '../dashboard/OwnerDashboard.vue';

// Importamos el componente de edición de perfil
import EditProfile from '../profile/components/edit-profile.component.vue';

// Para selección de suscripción
import SelectPlan from '../subscription/components/select-plan.component.vue';

// Importamos componentes específicos de la gestión
import SuppliersList from '../supply/components/SuppliersList.vue';
import SupplierDetails from '../supply/components/SupplierDetails.vue';
import CoffeeLotsList from '../coffee/components/CoffeeLotsList.vue';
import LotDetails from '../coffee/components/LotDetails.vue';
import RoastingProfilesList from '../roasting/components/RoastingProfilesList.vue';
import RoastingProfileDetails from '../roasting/components/RoastingProfileDetails.vue';
import RoastingProfilesCompare from '../roasting/components/RoastingProfilesCompare.vue';

// Componente para páginas no encontradas
const NotFound = { template: '<div>Página no encontrada</div>' };

const routes = [
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
    // Supplier routes
    {
        path: '/suppliers',
        name: 'Suppliers',
        component: SuppliersList,
        meta: { requiresAuth: true, role: 'dueno_cafeteria' }
    },
    {
        path: '/suppliers/:id',
        name: 'SupplierDetails',
        component: SupplierDetails,
        props: route => ({ supplierId: route.params.id }),
        meta: { requiresAuth: true, role: 'dueno_cafeteria' }
    },
    // Coffee Lot routes
    {
        path: '/lots',
        name: 'CoffeeLots',
        component: CoffeeLotsList,
        meta: { requiresAuth: true, role: 'dueno_cafeteria' }
    },
    {
        path: '/lots/:id',
        name: 'LotDetails',
        component: LotDetails,
        props: route => ({ lotId: route.params.id }),
        meta: { requiresAuth: true, role: 'dueno_cafeteria' }
    },
    // Roasting Profile routes
    {
        path: '/roasting',
        name: 'RoastingProfiles',
        component: RoastingProfilesList,
        meta: { requiresAuth: true, role: 'dueno_cafeteria' }
    },
    {
        path: '/roasting/:id',
        name: 'RoastingProfileDetails',
        component: RoastingProfileDetails,
        meta: { requiresAuth: true, role: 'dueno_cafeteria' }
    },
    {
        path: '/roasting/compare/:ids',
        name: 'RoastingProfilesCompare',
        component: RoastingProfilesCompare,
        meta: { requiresAuth: true, role: 'dueno_cafeteria' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

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