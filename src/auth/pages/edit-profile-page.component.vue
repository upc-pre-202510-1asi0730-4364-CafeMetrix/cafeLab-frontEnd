<template>
  <div class="edit-profile-page">
    <HeaderBar v-if="showToolbar" />
    <HeaderBarInit v-else />
    <div class="edit-profile-page-content">
      <EditProfileForm />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import EditProfileForm from '../../auth/components/edit-profile-form.component.vue';
import HeaderBar from "../../public/components/headerBar.vue";
import HeaderBarInit from "../../public/components/headerBarInit.vue";

export default {
  name: 'EditProfilePage',
  components: {
    HeaderBarInit,
    EditProfileForm,
    HeaderBar
  },
  setup() {
    const currentUser = computed(() => {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    });

    const showToolbar = computed(() => !!currentUser.value?.hasPlan);

    onMounted(() => {
    });

    return {
      currentUser,
      showToolbar
    };
  }
};
</script>

<style scoped>
.edit-profile-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.edit-profile-page-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  overflow-y: auto;
}


.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333333;
}
</style>