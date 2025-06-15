<template>
  <div class="edit-profile-page">
    <Toolbar v-if="showToolbar" />
    <Toolbarinit v-else />
    <div class="edit-profile-page-content">
      <EditProfileForm />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import EditProfileForm from '../../auth/components/edit-profile-form.component.vue';
import Toolbar from '../../public/components/toolbar.component.vue';
import Toolbarinit from '../../public/components/toolbarinit.component.vue';

export default {
  name: 'EditProfilePage',
  components: {
    EditProfileForm,
    Toolbar,
    Toolbarinit
  },
  setup() {
    const currentUser = computed(() => {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    });

    const showToolbar = computed(() => !!currentUser.value?.hasPlan);

    onMounted(() => {
      // Lógica de inicialización, si es necesario
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