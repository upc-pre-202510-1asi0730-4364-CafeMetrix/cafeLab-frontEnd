<template>
  <div>
    <CuppingHeader />
    <div class="payment-container">
      <div class="card">
        <button class="back-btn" @click="$router.push('/planes')">
          <i class="pi pi-arrow-left"></i> {{ $t('payment.backToPlans') }}
        </button>

        <div class="content">
          <div class="plan-info">
            <h2 class="plan-title">{{ $t('payment.completePlan') }}</h2>
            <div class="price-card">
              <div class="price">
                <span class="currency">{{ $t('payment.price') }}</span>
                <span class="amount">29</span>
                <span class="period">/{{ $t('payment.month') }}</span>
              </div>
              <ul class="features-list">
                <li>
                  <i class="pi pi-check-circle"></i>
                  {{ $t('payment.baristaPlan') }}
                </li>
                <li>
                  <i class="pi pi-check-circle"></i>
                  {{ $t('payment.ownerPlan') }}
                </li>
              </ul>
              <button class="start-btn" @click="scrollToPayment">
                {{ $t('payment.startPlan') }}
              </button>
            </div>
          </div>

          <div class="payment-section" ref="paymentSection">
            <h2 class="section-title">{{ $t('payment.processTitle') }}</h2>
            <p class="subtitle">{{ $t('payment.fillData') }}</p>

            <div class="payment-methods">
              <label class="payment-method">
                <input type="radio" name="paymentMethod" value="visa" v-model="paymentMethod">
                <img src="https://static-00.iconduck.com/assets.00/visa-icon-2048x1313-onrjd1ii.png" alt="Visa">
              </label>
              <label class="payment-method">
                <input type="radio" name="paymentMethod" value="mastercard" v-model="paymentMethod">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREHVsA36donZfCmEVES0pxJkSlLanfFOqyeg&s" alt="Mastercard">
              </label>
            </div>

            <form @submit.prevent="handleSubmit" class="payment-form">
              <div class="form-group">
                <label>{{ $t('payment.email') }}</label>
                <input 
                  type="email" 
                  v-model="formData.email"
                  placeholder="example@com"
                  required
                >
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ $t('payment.cardNumber') }}</label>
                  <input 
                    type="text" 
                    v-model="formData.cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ $t('payment.expiry') }}</label>
                  <input 
                    type="text" 
                    v-model="formData.expiry"
                    placeholder="MM/YY"
                    required
                  >
                </div>
                <div class="form-group">
                  <label>{{ $t('payment.cvc') }}</label>
                  <input 
                    type="text" 
                    v-model="formData.cvc"
                    placeholder="123"
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label>{{ $t('payment.cardHolder') }}</label>
                <input 
                  type="text" 
                  v-model="formData.cardHolder"
                  :placeholder="$t('payment.cardHolderPlaceholder')"
                  required
                >
              </div>

              <div class="form-group">
                <label>{{ $t('payment.country') }}</label>
                <select v-model="formData.country" required>
                  <option value="">{{ $t('payment.selectCountry') }}</option>
                  <option value="PE">Perú</option>
                  <option value="CO">Colombia</option>
                  <option value="CL">Chile</option>
                </select>
              </div>

              <button type="submit" class="submit-btn" :disabled="processing">
                <span v-if="!processing">{{ $t('payment.continue') }}</span>
                <span v-else>{{ $t('payment.processing') }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CuppingHeader from '../../shared/components/CuppingHeader.component.vue'

const router = useRouter()
const paymentSection = ref(null)
const processing = ref(false)

const paymentMethod = ref('visa')
const formData = ref({
  email: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardHolder: '',
  country: ''
})

// Añadir clase de fondo cuando se monta el componente
onMounted(() => {
  document.body.classList.add('payment-bg')
})

// Eliminar clase de fondo cuando se desmonta el componente
onUnmounted(() => {
  document.body.classList.remove('payment-bg')
})

const scrollToPayment = () => {
  paymentSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleSubmit = async (e) => {
  e.preventDefault()
  processing.value = true

  try {
    // Simulación simple del proceso de pago
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirigir al dashboard después del pago "exitoso"
    router.push('/dashboard')
  } catch (err) {
    console.error('Error al procesar el pago:', err)
    processing.value = false
  }
}
</script>

<style scoped>
.payment-container {
  background-color: #F8F7F2;
  min-height: 100vh;
  padding: 120px 40px 40px;
  box-sizing: border-box;
}

.card {
  background: white;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #f5f5f5;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 60px;
}

.plan-title {
  font-size: 32px;
  color: #2C3E50;
  margin-bottom: 24px;
}

.price-card {
  background: #c38757;
  border-radius: 16px;
  padding: 30px;
  color: white;
}

.price {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
}

.currency {
  font-size: 24px;
  vertical-align: super;
}

.period {
  font-size: 18px;
  opacity: 0.8;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 16px;
}

.features-list i {
  font-size: 18px;
}

.start-btn {
  width: 100%;
  background-color: #2C3E50;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
}

.start-btn:hover {
  transform: translateY(-2px);
  background-color: #34495E;
}

.payment-section {
  padding: 20px;
}

.section-title {
  font-size: 28px;
  color: #2C3E50;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 24px;
}

.payment-methods {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.payment-method img {
  height: 24px;
  object-fit: contain;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  background-color: #F8F7F2;
  color: #2C3E50;
}

.form-group input::placeholder {
  color: #95a5a6;
}

.form-group select {
  color: #2C3E50;
}

.form-group select option {
  color: #2C3E50;
  background-color: #F8F7F2;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #c38757;
  outline: none;
}

.submit-btn {
  background-color: #c38757;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 16px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #a06c3c;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 968px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .card {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}
</style> 