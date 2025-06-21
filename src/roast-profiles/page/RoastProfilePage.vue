<template>
  <div>
    <HeaderBar />
    <div class="roast-profile-page">
      <RoastProfileList />
    </div>
  </div>
</template>

<script>
import RoastProfileList from '../components/RoastProfileList.vue';
import HeaderBar from "../../public/components/headerBar.vue";

export default {
  name: 'RoastProfilePage',
  components: {
    HeaderBar,
    RoastProfileList
  }
};
</script>

<style scoped>
.roast-profile-page {
  min-height: 100vh;
  background: #f8f9fa;
}
</style> 