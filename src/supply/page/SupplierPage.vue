<template>
  <div class="supply-page">
    <header class="headerBar">
      <headerBar />
    </header>
  </div>
    <!-- Lista de proveedores -->
  <div class="suppliers-container">
    <SupplierList />
  </div>
</template>

<script>
import headerBar from '../../public/components/headerBar.vue'
import SupplierList from '../components/SupplierList.vue'; // ajusta la ruta si es distinta

export default {
  name: 'SupplyPage',
  components: {
    headerBar,
    SupplierList
  }
};
</script>

<style scoped>
.suppliers-container{
  margin-top: 4rem;
}
</style>
