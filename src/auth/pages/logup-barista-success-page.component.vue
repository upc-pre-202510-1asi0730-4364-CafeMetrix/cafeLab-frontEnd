<template>
  <div class="logup-barista-success-page">
    <Toolbarinit class="toolbar" />
    <div class="success-content">
      <div class="success-message">
        <h2>{{ t('LOGUP_BARISTA_SUCCESS.TITLE') }}</h2>
        <p>{{ t('LOGUP_BARISTA_SUCCESS.MESSAGE') }}</p>
        <pv-button class="continue-button" @click="onContinue">
          {{ t('LOGUP_BARISTA_SUCCESS.CONTINUE') }}
        </pv-button>
      </div>
      <div class="background-image" aria-hidden="true"></div>
    </div>
  </div>
</template>


<script>
import { useRouter } from 'vue-router';
import Toolbarinit from '../../public/components/toolbarinit.component.vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'LogupBaristaSuccessPage',
  components: {
    Toolbarinit
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();

    function onContinue() {
      router.push({ name: 'editProfile' });
    }

    return {
      onContinue,
      t
    };
  }
};
</script>

<style scoped>
.logup-barista-success-page {
  height: 100vh;
  width: 100vw;
  background: #222; /* fondo externo, para el borde oscuro */
  display: flex;
  flex-direction: column;
}

.toolbar {
  width: 100vw;
  z-index: 20;
  position: relative;
}

.success-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background: #F8F7F2;
  overflow: hidden;
}

.success-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  padding: 48px 64px;
  max-width: 420px;
  min-width: 360px;
  min-height: 260px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.13);
  z-index: 2;
  margin-left: 7vw;
  gap: 24px;
  position: relative;
}

.success-message h2 {
  margin: 0 0 8px 0;
  font: 600 28px/1.2 "Montserrat", sans-serif;
  color: #374331;
}

.success-message p {
  margin: 0 0 12px 0;
  font: 16px/1.4 "Montserrat", sans-serif;
  color: #7B7B6F;
}

.continue-button {
  border: none;
  border-radius: 50px;
  padding: 14px 32px;
  font: 600 15px "Montserrat", sans-serif;
  cursor: pointer;
  background: linear-gradient(135deg, #4D6443 0%, #5a6b2a 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(77,100,67,0.35), 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.25s, box-shadow 0.25s, background 0.25s, color 0.25s;
  position: relative;
  margin-top: 16px;
}

.continue-button:hover {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  color: #4D6443;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.09);
}

.background-image {
  position: absolute;
  right: 0;
  top: 0;
  width: 60vw;
  height: 100vh;
  background-image: url('../../../public/logupbarista.png');
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;
  filter: brightness(0.89);
  z-index: 1;
  clip-path: polygon(18% 0, 100% 0, 100% 100%, 0% 100%);
}

/* Ajuste responsivo */
@media (max-width: 900px) {
  .success-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .background-image {
    position: absolute;
    width: 100vw;
    height: 40vh;
    clip-path: none;
    top: 0;
    left: 0;
  }
  .success-message {
    min-width: 0;
    max-width: 96vw;
    height: auto;
    margin: 40vh auto 0 auto;
    align-items: center;
    text-align: center;
  }
}

</style>