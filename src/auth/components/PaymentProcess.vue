<template>
  <div>
    <CuppingHeader />

    <div class="payment-container">
      <div class="card">
        <button class="back-btn" @click="$router.push('/plan')">{{ $t('payment.backToPlans') }}</button>

        <div class="content">
          <div class="plan-info">
            <h1 class="section-title">{{ $t('payment.planTitle') }}</h1>
            <div class="price-card">
              <p><strong>s/.19/{{ $t('payment.month') }}</strong></p>
              <ul>
                <li>✔ {{ $t('payment.cuppingSessions') }}</li>
                <li>✔ {{ $t('payment.defectLibrary') }}</li>
                <li>✔ {{ $t('payment.roastCorrelation') }}</li>
                <li>✔ {{ $t('payment.grindCalibration') }}</li>
                <li>✔ {{ $t('payment.recipes') }}</li>
              </ul>
              <button class="start-btn">{{ $t('payment.startPlan') }}</button>
            </div>
          </div>

          <div class="form-section">
            <h1 class="section-title">{{ $t('payment.title') }}</h1>
            <p class="subtitle">{{ $t('payment.description') }}</p>
            <div class="cards">
              <label><input type="radio" name="card" v-model="cardType" value="visa" /> <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" width="40" /></label>
              <label><input type="radio" name="card" v-model="cardType" value="mastercard" /> <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" width="40" /></label>
            </div>
            <form ref="form">
              <input v-model="email" type="email" :placeholder="$t('payment.emailPlaceholder')" />
              <input v-model="cardNumber" type="text" :placeholder="$t('payment.cardPlaceholder')" />
              <div class="row">
                <input v-model="expiry" type="text" :placeholder="$t('payment.expiryPlaceholder')" />
                <input v-model="cvc" type="text" :placeholder="$t('payment.cvcPlaceholder')" />
              </div>
              <input v-model="holder" type="text" :placeholder="$t('payment.holderPlaceholder')" />
              <select v-model="country">
                <option value="">{{ $t('payment.selectCountry') }}</option>
                <option>Peru</option>
                <option>Colombia</option>
                <option>Chile</option>
              </select>
            </form>
            <button class="continue-btn" @click="continuar">{{ $t('payment.button') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CuppingHeader from '../../shared/components/CuppingHeader.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

// Campos del formulario
const cardType = ref('')
const email = ref('')
const cardNumber = ref('')
const expiry = ref('')
const cvc = ref('')
const holder = ref('')
const country = ref('')

const continuar = () => {
  if (
      !cardType.value ||
      !email.value.trim() ||
      !cardNumber.value.trim() ||
      !expiry.value.trim() ||
      !cvc.value.trim() ||
      !holder.value.trim() ||
      !country.value.trim()
  ) {
    alert('Por favor, complete todos los campos.')
    return
  }

  // Redirigir si todo está correcto
  router.push('/dashboard')
}
</script>

<style scoped>
.payment-container {
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 130px;
  box-sizing: border-box;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 40px 50px;
  width: 95%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 15px rgba(0,0,0,0.15);
}

.content {
  display: flex;
  flex-direction: row;
  gap: 50px;
  justify-content: space-between;
  align-items: flex-start;
}

.plan-info {
  flex: 1;
}

.price-card {
  background-color: #c38757;
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.2);
}

.start-btn {
  margin-top: 15px;
  background: #444;
  color: white;
  padding: 10px;
  border-radius: 8px;
  border: none;
}

.form-section {
  flex: 1.5;
}

.cards {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  gap: 10px;
}

.continue-btn {
  background: #444;
  color: white;
  padding: 12px;
  margin-top: 15px;
  border-radius: 8px;
  border: none;
  width: 120px;
}

.back-btn {
  background-color: #444;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  align-self: flex-start;
  margin-bottom: 20px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #3e3e3e;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
}

.subtitle {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
