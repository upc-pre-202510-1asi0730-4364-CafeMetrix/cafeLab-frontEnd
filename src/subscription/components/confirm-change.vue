<template>
  <header-bar-init color="primary">
    <HeaderBarInit />
  </header-bar-init>

  <div class="background">
    <div class="container">
      <div class="card">

        <!-- Botón Volver -->
        <button class="back-button" @click="goBack">
          {{ $t('CONFIRM.BACK') }}
        </button>

        <!-- Columna Izquierda: Plan seleccionado -->
        <div class="plan-section">
          <h2 class="plan-title">{{ selectedPlan?.translationKey ? $t(selectedPlan.translationKey) : '' }}</h2>
          <div class="plan-card">
            <p class="plan-price">
              ${{ selectedPlan?.price }} / {{ $t('PLANS.MONTH') }}
            </p>
            <ul class="plan-features">
              <li v-for="feature in translatedFeatures || []" :key="feature">• {{ feature }}</li>
            </ul>
          </div>
        </div>

        <!-- Columna Derecha: Formulario de pago -->
        <div class="payment-section">
          <h2 class="payment-title">{{ $t('CONFIRM.PAYMENT.TITLE') }}</h2>
          <form @submit.prevent="onSubmit" class="payment-form">

            <div v-for="field in fields" :key="field.name" class="form-field">

              <label :for="field.name" class="form-label">
                {{ $t(field.placeholder) }}
              </label>

              <!-- Campo de País como Select -->
              <select
                v-if="field.type === 'select'"
                v-model="paymentForm.country"
                :id="field.name"
                :name="field.name"
                :class="getFieldClass(field.name).replace('form-input', 'form-select')"
              >
                <option value="">{{ $t('CONFIRM.PAYMENT.SELECT_COUNTRY') }}</option>
                <option v-for="country in latinAmericanCountries" :key="country" :value="country">
                  {{ $t('COUNTRIES.' + country) }}
                </option>
              </select>

              <!-- Otros Campos como Input -->
              <input
                  v-else
                  v-model="paymentForm[field.name]"
                  :id="field.name"
                  :name="field.name"
                  :type="field.type"
                  :placeholder="$t(field.placeholder)"
                  :maxlength="field.maxlength"
                  :inputmode="field.inputmode"
                  :pattern="field.pattern"
                  :autocomplete="field.autocomplete || 'off'"
                  :class="getFieldClass(field.name)"
                  @input="field.sanitize && sanitizeInput($event, field.maxlength, field.name)"
              />

              <!-- Errores -->
              <div v-if="hasError(field.name, 'required')" class="error-message">
                {{ $t(field.requiredError) }}
              </div>
              <div v-if="hasError(field.name, 'pattern')" class="error-message">
                {{ $t(field.patternError) }}
                <span class="error-example">{{ $t(field.exampleKey) }}</span>
              </div>

            </div>

            <button type="submit" class="submit-button">
              {{ $t('CONFIRM.PAYMENT.CONFIRM') }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import userService from '../../auth/services/user.service.js'
import HeaderBarInit from "../../public/components/headerBarInit.vue";

const latinAmericanCountries = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'República Dominicana',
  'Uruguay',
  'Venezuela'
]

const router = useRouter()
const { t, tm, locale } = useI18n()

const selectedPlan = ref(null)
const translatedFeatures = ref([])
const formSubmitted = ref(false)

const paymentForm = reactive({
  email: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardHolder: '',
  country: '',
})

const fields = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'CONFIRM.PAYMENT.EMAIL',
    requiredError: 'CONFIRM.ERRORS.EMAIL_REQUIRED',
    patternError: 'CONFIRM.ERRORS.EMAIL_INVALID',
    exampleKey: 'CONFIRM.EXAMPLES.EMAIL',
    pattern: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    autocomplete: 'email',
  },
  {
    name: 'cardNumber',
    type: 'text',
    placeholder: 'CONFIRM.PAYMENT.CARD_NUMBER',
    requiredError: 'CONFIRM.ERRORS.CARD_NUMBER_REQUIRED',
    patternError: 'CONFIRM.ERRORS.CARD_NUMBER_INVALID',
    exampleKey: 'CONFIRM.EXAMPLES.CARD_NUMBER',
    pattern: '\\d{16}',
    maxlength: 16,
    inputmode: 'numeric',
    sanitize: true,
    autocomplete: 'cc-number',
  },
  {
    name: 'expiry',
    type: 'text',
    placeholder: 'CONFIRM.PAYMENT.EXPIRY',
    requiredError: 'CONFIRM.ERRORS.EXPIRY_REQUIRED',
    patternError: 'CONFIRM.ERRORS.EXPIRY_INVALID',
    exampleKey: 'CONFIRM.EXAMPLES.EXPIRY',
    pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
    maxlength: 5,
    autocomplete: 'cc-exp',
  },
  {
    name: 'cvc',
    type: 'text',
    placeholder: 'CONFIRM.PAYMENT.CVC',
    requiredError: 'CONFIRM.ERRORS.CVC_REQUIRED',
    patternError: 'CONFIRM.ERRORS.CVC_INVALID',
    exampleKey: 'CONFIRM.EXAMPLES.CVC',
    pattern: '\\d{3}',
    maxlength: 3,
    inputmode: 'numeric',
    sanitize: true,
    autocomplete: 'cc-csc',
  },
  {
    name: 'cardHolder',
    type: 'text',
    placeholder: 'CONFIRM.PAYMENT.HOLDER',
    requiredError: 'CONFIRM.ERRORS.CARD_HOLDER_REQUIRED',
    patternError: 'CONFIRM.ERRORS.CARD_HOLDER_INVALID',
    exampleKey: 'CONFIRM.EXAMPLES.CARD_HOLDER',
    autocomplete: 'cc-name',
  },
  {
    name: 'country',
    type: 'select',
    placeholder: 'COUNTRY',
    requiredError: 'COUNTRY_REQUIRED',
    patternError: 'COUNTRY_INVALID',
    exampleKey: 'COUNTRY',
  }
]

const sanitizeInput = (event, maxLength, fieldName) => {
  let value = event.target.value.replace(/\D/g, '').slice(0, maxLength)
  paymentForm[fieldName] = value
}

const getFieldClass = (field) => {
  return isFieldInvalid(field) ? 'form-input form-input-error' : 'form-input'
}

const isFieldInvalid = (field) => {
  return formSubmitted.value && !paymentForm[field]
}

const hasError = (field, type) => {
  if (!formSubmitted.value) return false
  const value = paymentForm[field]

  if (type === 'required') return !value

  // Solo aplica pattern si está definido en fields
  const fieldConf = fields.find(f => f.name === field)
  if (type === 'pattern' && fieldConf?.pattern) {
    const regex = new RegExp(fieldConf.pattern)
    return !regex.test(value)
  }

  return false
}

const loadTranslatedFeatures = (planType) => {
  let key = ''
  switch (planType) {
    case 'barista': key = 'PLANS.BARISTA.FEATURES'; break
    case 'owner': key = 'PLANS.OWNER.FEATURES'; break
    case 'complete': key = 'PLANS.FULL.FEATURES'; break
  }
  translatedFeatures.value = tm(key)
}

const onSubmit = async () => {
  formSubmitted.value = true

  const hasErrors = fields.some(field =>
      hasError(field.name, 'required') || hasError(field.name, 'pattern')
  ) || hasError('country', 'required')

  if (hasErrors) return

  try {
    // Cambiar el plan del usuario solo si se confirma el pago
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const selectedPlanObj = JSON.parse(localStorage.getItem('selectedPlan') || '{}');
    if (!currentUser.id || !selectedPlanObj.type) {
      console.error('No hay usuario en sesión o plan seleccionado.');
      return;
    }
    const updatedUser = {
      ...currentUser,
      plan: selectedPlanObj.type,
      hasPlan: true
    };
    await userService.updateProfile(currentUser.id, updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Redirigir al dashboard correspondiente
    switch (selectedPlanObj.type) {
      case 'owner':
        router.push('/dashboard/owner');
        break;
      case 'barista':
        router.push('/dashboard/barista');
        break;
      case 'complete':
        router.push('/dashboard/complete');
        break;
      default:
        router.push('/page-not-found');
    }
  } catch (err) {
    console.error('Error confirmando cambio de plan:', err)
  }
}

const goBack = () => {
  router.push('/select-plan-change')
}

onMounted(() => {
  const stored = localStorage.getItem('selectedPlan')
  if (!stored) {
    router.push({ name: 'select-plan-change' })
    return
  }
  selectedPlan.value = JSON.parse(stored)
  loadTranslatedFeatures(selectedPlan.value.type)
})

watch(locale, () => {
  if (selectedPlan.value) {
    loadTranslatedFeatures(selectedPlan.value.type)
  }
})
</script>

<style scoped>
.background {
  background-image: url('../../../public/fondo_planes.png');
  min-height: 100vh;
  background-size: cover;
  background-position: center;
}

.container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
}

.card {
  background-color: #F8F7F2;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 6rem;
  position: relative;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #414535;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333228;
  }
}

.plan-section {
  .plan-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .plan-card {
    background-color: #C68F61;
    border-radius: 0.25rem;
    padding: 1rem;
    color: white;

    .plan-price {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .plan-features {
      margin-top: 0.5rem;
      padding: 0;
      list-style: none;

      li {
        margin-bottom: 0.25rem;
      }
    }
  }
}

.payment-section {
  .payment-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .payment-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .form-input,
    .form-select {
      width: 90%;
      border: 1px solid #d1d5db;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: #414535;
        box-shadow: 0 0 0 3px rgba(65, 69, 53, 0.1);
      }
    }

    .form-input-error,
    .form-select-error {
      border-color: #dc2626;
      background-color: #fef2f2;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.875rem;
    }

    .error-example {
      display: block;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .submit-button {
      background-color: #414535;
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      align-self: flex-end;
      transition: background-color 0.2s;

      &:hover:not(:disabled) {
        background-color: #333228;
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }
    }
  }
}
</style> 