<template>
  <div class="app-navbar">
    <div class="user-section" v-if="isLoggedIn">
      <button class="logout-btn" @click="logout">
        <i class="pi pi-sign-out"></i> Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNavBar',
  computed: {
    isLoggedIn() {
      return localStorage.getItem('currentUser') !== null;
    },
    username() {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return user.name || 'Usuario';
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.app-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #4c4c3d;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  font-size: 0.9rem;
}

.logout-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>