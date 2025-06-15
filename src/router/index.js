import { createRouter, createWebHistory } from 'vue-router';

const LoginPage = () => import('../auth/pages/login-page.component.vue');
const LoginSuccessPage = () => import('../auth/pages/login-success-page.component.vue');
const LogupBaristaPage = () => import('../auth/pages/logup-barista-page.component.vue');
const LogupBaristaSuccessPage = () => import('../auth/pages/logup-barista-success-page.component.vue');
const LogupOwnerPage = () => import('../auth/pages/logup-owner-page.component.vue');
const LogupOwnerSuccessPage = () => import('../auth/pages/logup-owner-success-page.component.vue');
const EditProfilePage = () => import('../auth/pages/edit-profile-page.component.vue');
const SelectPlan = () => import('../subscription/components/select-plan.component.vue');
const BaristaDashboard = () => import('../dashboard/components/barista-dashboard.component.vue');
const OwnerDashboard = () => import('../dashboard/components/owner-dashboard.vue');
const CompleteDashboard = () => import('../dashboard/components/complete-dashboard.vue');
const PageNotFound = () => import('../public/pages/page-not-found.component.vue');

const routes = [
    { path: '/',                        name: 'default',             redirect: { name: 'login' } },
    { path: '/login',                   name: 'login',               component: LoginPage,               meta: { title: 'Login' } },
    { path: '/login/success',           name: 'loginSuccess',        component: LoginSuccessPage,        meta: { title: 'Login Success' } },
    { path: '/register/barista',        name: 'registerBarista',     component: LogupBaristaPage,        meta: { title: 'Register Barista' } },
    { path: '/logup/barista/success',   name: 'logupBaristaSuccess', component: LogupBaristaSuccessPage, meta: { title: 'Barista Registration Success' } },
    { path: '/register/owner',          name: 'registerOwner',       component: LogupOwnerPage,          meta: { title: 'Register Owner' } },
    { path: '/logup/owner/success',     name: 'logupOwnerSuccess',   component: LogupOwnerSuccessPage,   meta: { title: 'Owner Registration Success' } },
    { path: '/edit-profile',            name: 'editProfile',         component: EditProfilePage,         meta: { title: 'Edit Profile' } },
    { path: '/subscription/selectplan', name: 'selectPlan',          component: SelectPlan,              meta: { title: 'Select Plan' } },
    { path: '/dashboard/barista',       name: 'baristaDashboard',    component: BaristaDashboard,        meta: { title: 'Barista Dashboard' } },
    { path: '/dashboard/owner',         name: 'ownerDashboard',      component: OwnerDashboard,          meta: { title: 'Owner Dashboard' } },
    { path: '/dashboard/complete',      name: 'completeDashboard',   component: CompleteDashboard,       meta: { title: 'Complete Dashboard' } },
    { path: '/:pathMatch(.*)*',         name: 'notFound',            component: PageNotFound,            meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'Café Lab';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;