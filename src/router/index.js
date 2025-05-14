import { createRouter, createWebHistory } from 'vue-router'
import PaymentProcess from '../auth/components/PaymentProcess.vue'
import BaristaDashboard from '../profiles/components/BaristaDashboard.vue'
import CuppingSessionList from '../sensory-evaluation/components/CuppingSessionList.vue'
import CuppingSessionDetail from '../sensory-evaluation/components/CuppingSessionDetail.vue'
import InventoryView from '../administration/InventoryView.vue'
import CostRegisterWizard from '../administration/CostRegisterWizard.vue'
import DefectList from '../roasting/components/DefectList.vue';
import DefectDetails from '../roasting/components/DefectDetails.vue';
import TastingPattern from '../sensory-evaluation/components/TastingPattern.vue';
import TastingPatternOverview from '../sensory-evaluation/components/TastingPatternOverview.vue'
import Calibration from '../roasting/components/Calibration.vue';
const routes = [
    { path: '/', redirect: '/pago' }, // ✅ redirección inicial
    { path: '/pago', name: 'ProcesoPago', component: PaymentProcess },
    { path: '/dashboard', name: 'BaristaDashboard', component: BaristaDashboard },
    { path: '/cata', name: 'CuppingSessions', component: CuppingSessionList },
    { path: '/defects', name: 'defectList', component: DefectList, },
    { path: '/defect/:defectId', name: 'defectDetails',  component: DefectDetails, props: true, },
    { path: '/tasting-pattern', name: 'TastingPattern', component: () => import('../sensory-evaluation/components/TastingPattern.vue')},
    { path: '/tasting-pattern-overview', name: 'TastingPatternOverview', component: () => import('../sensory-evaluation/components/TastingPatternOverview.vue')},
    { path: '/tasting-pattern-overview', name: 'TastingPatternOverview', component: TastingPatternOverview, },
    { path: '/calibration', name: 'Calibration', component: Calibration,},



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
