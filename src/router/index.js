import { createRouter, createWebHistory } from 'vue-router'
import PaymentProcess from '../auth/components/PaymentProcess.vue'
import BaristaDashboard from '../profiles/components/BaristaDashboard.vue'
import CuppingSessionList from '../sensory-evaluation/components/CuppingSessionList.vue'
import CuppingSessionDetail from '../sensory-evaluation/components/CuppingSessionDetail.vue'
import InventoryView from '../administration/pages/InventoryView.vue'
import CostRegisterWizard from '../administration/pages/CostRegisterWizard.vue'

const routes = [
    { path: '/', redirect: '/pago' }, // ✅ redirección inicial
    { path: '/pago', name: 'ProcesoPago', component: PaymentProcess },
    { path: '/dashboard', name: 'BaristaDashboard', component: BaristaDashboard },
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
    { path: '/costos-lote', name: 'CostRegisterWizard', component: CostRegisterWizard }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
