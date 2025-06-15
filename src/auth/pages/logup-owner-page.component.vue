<template>
  <Toolbarinit />
  <div class="logup-owner-page">
    <div class="background-image"></div>
    <div class="form-container">
      <LogupOwnerForm />
    </div>
  </div>
</template>

<script>
import LogupOwnerForm from '../components/logup-owner-form.vue';
import Toolbarinit from '../../public/components/toolbarinit.component.vue';

export default {
  name: 'LogupOwnerPage',
  components: {
    LogupOwnerForm,
    Toolbarinit
  }
};
</script>

<style scoped>
html, body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #222; /* solo para ver si algo se desborda */
  overflow: hidden;
}

.logup-owner-page {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  background: #F8F7F2;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 58vw;
  min-height: 100vh;
  min-width: 0;
  background-image: url('../../../public/logupowner.png');
  background-size: cover;
  background-position: center;
  filter: brightness(0.97);
  z-index: 0;
  clip-path: polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%);
  pointer-events: none;
  overflow: hidden;
}

.form-container {
  position: relative;
  z-index: 2;
  margin-left: 10vw;
  display: flex;
  align-items: center;
  height: 100vh;
  min-height: 100vh;
}

.form-container > * {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(76, 84, 62, 0.10), 0 1.5px 6px rgba(0,0,0,0.06);
  padding: 38px 36px 30px 36px;
  width: 380px;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

</style>
