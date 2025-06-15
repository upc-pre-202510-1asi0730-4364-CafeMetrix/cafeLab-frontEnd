<template>
  <div class="login-page">
    <Toolbarinit />
    <div class="login-page-content">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/login-form.component.vue';
import Toolbarinit from '../../public/components/toolbarinit.component.vue';

export default {
  name: 'LoginPage',
  components: {
    LoginForm,
    Toolbarinit
  }
};
</script>

<style scoped>
.login-page {
  /* Estilos para abarcar toda la página y eliminar barras de desplazamiento */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url('../../../public/login.png');
  background-size: cover;
  background-position: center;
}

.login-page-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
</style>