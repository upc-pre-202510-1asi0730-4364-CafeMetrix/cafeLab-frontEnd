import { createRouter, createWebHistory } from 'vue-router';
import OwnerDashboard from '../dashboard/OwnerDashboard.vue';
import SuppliersList from '../supply/components/SuppliersList.vue';
import SupplierDetails from '../supply/components/SupplierDetails.vue';
import CoffeeLotsList from '../coffee/components/CoffeeLotsList.vue';
import LotDetails from '../coffee/components/LotDetails.vue';
import RoastingProfilesList from '../roasting/components/RoastingProfilesList.vue';
import RoastingProfileDetails from '../roasting/components/RoastingProfileDetails.vue';
import RoastingProfilesCompare from '../roasting/components/RoastingProfilesCompare.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: OwnerDashboard
  },
  // Supplier routes
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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 