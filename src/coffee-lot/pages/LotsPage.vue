<template>
  <div class="lots-page">
    <!-- Barra de herramientas -->
    <header class="headerBar">
      <HeaderBar />
    </header>

    <!-- Lista de lotes -->
    <div class="lots-container">
      <LotListComponent />
    </div>
  </div>
</template>

<script>
import ToolbarComponent from '../../public/components/toolbar.component.vue'
import LotListComponent from '../components/lot-list.component.vue'
import HeaderBar from "../../public/components/headerBar.vue"; // Ajusta si es necesario

export default {
  name: 'LotsPage',
  components: {
    HeaderBar,
    ToolbarComponent,
    LotListComponent
  }
}
</script>

<style scoped>
.lots-container {
  margin-top: 4rem;
}
</style>
