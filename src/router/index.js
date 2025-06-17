import { createRouter, createWebHistory } from 'vue-router'
import BaristaDashboard from '../profiles/components/BaristaDashboard.vue'
import DefectList from '../roasting/components/DefectList.vue';
import DefectDetails from '../roasting/components/DefectDetails.vue';
import TastingPattern from '../sensory-evaluation/components/TastingPattern.vue';
import TastingPatternOverview from '../sensory-evaluation/components/TastingPatternOverview.vue'
import Calibration from '../roasting/components/Calibration.vue';
import RoastingPage from '../roasting/pages/RoastingPage.vue'
import SensoryEvaluationPage from '../sensory-evaluation/pages/SensoryEvaluationPage.vue'
import ProfilesPage from '../profiles/pages/ProfilesPage.vue'
import DefectPage from '../roasting/pages/DefectPage.vue'
import CalibrationPage from '../roasting/pages/CalibrationPage.vue'

const routes = [
    { path: '/defects', name: 'defectList', component: DefectList, },
    { path: '/defect/:defectId', name: 'defectDetails',  component: DefectDetails, props: true, },
    { path: '/tasting-pattern', name: 'TastingPattern', component: () => import('../sensory-evaluation/components/TastingPattern.vue')},
    { path: '/tasting-pattern-overview', name: 'TastingPatternOverview', component: () => import('../sensory-evaluation/components/TastingPatternOverview.vue')},
    { path: '/tasting-pattern-overview', name: 'TastingPatternOverview', component: TastingPatternOverview, },
    { path: '/calibration', name: 'Calibration', component: Calibration,},
    { path: '/roasting', component: RoastingPage },
    { path: '/roasting/defects', component: DefectPage },
    { path: '/roasting/calibrations', component: CalibrationPage },
    { path: '/sensory-evaluation', component: SensoryEvaluationPage },
    { path: '/profiles', component: ProfilesPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
