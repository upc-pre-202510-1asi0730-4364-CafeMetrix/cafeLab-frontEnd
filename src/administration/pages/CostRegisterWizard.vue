<template>
  <div class="cost-register-view">
    <HeaderBar />
    <div class="breadcrumb">
      {{ $t('breadcrumb.home') }} <span class="chevron">&gt;</span> <strong>{{ $t('costs.registerTitle') }}</strong>
    </div>
    <div class="steps-row">
      <div :class="['step-card', { active: step === 1 }]">1. {{ $t('costs.step1') }}</div>
      <div :class="['step-card', { active: step === 2 }]">2. {{ $t('costs.step2') }}</div>
      <div :class="['step-card', { active: step === 3 }]">3. {{ $t('costs.step3') }}</div>
      <div :class="['step-card', { active: step === 4 }]">4. {{ $t('costs.step4') }}</div>
    </div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: (step - 1) * 33 + '%' }"></div>
    </div>
    <div class="step-content">
      <h2>{{ $t(`costs.stepTitle${step}`) }}</h2>
      <template v-if="step === 1">
        <div v-if="!loteSeleccionado">
          <input class="input-lote" v-model="lote" :placeholder="$t('costs.lotPlaceholder')" />
        </div>
        <div v-else>
          <div class="selected-lot-row">
            <span class="selected-lot-label">{{ $t('costs.step1') }}:</span>
            <span class="selected-lot-value">{{ lote }}</span>
            <button class="change-lot-btn" @click="loteSeleccionado = false">{{ $t('costs.changeLot') || 'Cambiar lote' }}</button>
          </div>
          <div class="costs-row">
            <div class="cost-card">
              <h3>{{ $t('costs.rawMaterialTitle') }}</h3>
              <div class="cost-fields">
                <div>
                  <label>{{ $t('costs.cafeVerdeCost') }}</label>
                  <input v-model="costoKgCafeVerde" type="number" min="0" step="0.01" />
                </div>
                <div>
                  <label>{{ $t('costs.cafeVerdeQty') }}</label>
                  <input v-model="cantidadCafeVerde" type="number" min="0" step="0.01" />
                </div>
                <div>
                  <label>{{ $t('costs.rawMaterialTotal') }}</label>
                  <input :value="totalMateriaPrima" readonly class="readonly" />
                </div>
              </div>
            </div>
            <div class="cost-card">
              <h3>{{ $t('costs.laborTitle') }}</h3>
              <div class="cost-fields">
                <div>
                  <label>{{ $t('costs.hoursWorked') }}</label>
                  <input v-model="horasTrabajadas" type="number" min="0" step="0.01" />
                </div>
                <div>
                  <label>{{ $t('costs.hourCost') }}</label>
                  <input v-model="costoPorHora" type="number" min="0" step="0.01" />
                </div>
                <div>
                  <label>{{ $t('costs.numWorkers') }}</label>
                  <input v-model="numeroTrabajadores" type="number" min="0" step="1" />
                </div>
                <div>
                  <label>{{ $t('costs.laborTotal') }}</label>
                  <input :value="totalManoObra" readonly class="readonly" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="step === 2">
        <div class="costs-directos-layout">
          <div class="costs-row-top">
            <div class="cost-card transport-card exact">
              <h3>{{ $t('costs.transportTitle') }}</h3>
              <div class="cost-fields-horizontal">
                <div>
                  <label>{{ $t('costs.cafeVerdeCost') }}</label>
                  <input v-model="costoTransporteKgCafeVerde" type="number" min="0" step="0.01" />
                </div>
                <div>
                  <label>{{ $t('costs.cafeVerdeQty') }}</label>
                  <input v-model="cantidadTransporteCafeVerde" type="number" min="0" step="0.01" />
                </div>
                <div>
                  <label>{{ $t('costs.rawMaterialTotal') }}</label>
                  <input :value="totalTransporteMateriaPrima" readonly class="readonly" />
                </div>
              </div>
            </div>
            <div class="cost-card storage-card exact">
              <h3>{{ $t('costs.storageTitle') }}</h3>
              <div class="cost-fields-horizontal">
                <div>
                  <label>{{ $t('costs.storageDays') }}</label>
                  <input v-model="diasAlmacen" type="number" min="0" step="1" placeholder="días" />
                </div>
                <div>
                  <label>{{ $t('costs.storageDailyCost') }}</label>
                  <input v-model="costoDiarioAlmacen" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div>
                  <label>{{ $t('costs.storageTotal') }}</label>
                  <input :value="totalAlmacenamiento" readonly class="readonly" />
                </div>
              </div>
            </div>
          </div>
          <div class="costs-row-bottom">
            <div class="cost-card processing-card exact">
              <h3>{{ $t('costs.processingTitle') }}</h3>
              <div class="cost-fields-horizontal processing">
                <div>
                  <label>{{ $t('costs.energy') }}</label>
                  <input v-model="energiaElectrica" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div>
                  <label>{{ $t('costs.maintenance') }}</label>
                  <input v-model="mantenimientoMaquinaria" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div>
                  <label>{{ $t('costs.supplies') }}</label>
                  <input v-model="insumosProcesamiento" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div>
                  <label>{{ $t('costs.water') }}</label>
                  <input v-model="aguaUtilizada" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div>
                  <label>{{ $t('costs.depreciation') }}</label>
                  <input v-model="depreciacionEquipos" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
              </div>
            </div>
            <div class="cost-card indirect-card exact">
              <h3>{{ $t('costs.otherIndirectTitle') }}</h3>
              <div class="cost-fields-horizontal indirect">
                <div>
                  <label>{{ $t('costs.qualityControl') }}</label>
                  <input v-model="controlCalidad" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div>
                  <label>{{ $t('costs.certifications') }}</label>
                  <input v-model="certificaciones" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div>
                  <label>{{ $t('costs.insurance') }}</label>
                  <input v-model="seguros" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
                <div class="admin-expense">
                  <label>{{ $t('costs.adminExpenses') }}</label>
                  <input v-model="gastosAdministrativos" type="number" min="0" step="0.01" placeholder="$0.00" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="step === 3">
        <div class="summary-layout">
          <div class="summary-table-card">
            <table class="summary-table">
              <thead>
                <tr>
                  <th>{{ $t('costs.summaryCategory') }}</th>
                  <th>{{ $t('costs.summaryAmount') }}</th>
                  <th>{{ $t('costs.summaryPercent') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ $t('costs.summaryRawMaterial') }}</td>
                  <td>{{ formatCurrency(totalMateriaPrima) }}</td>
                  <td>{{ percentOfTotal(totalMateriaPrima) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('costs.summaryLabor') }}</td>
                  <td>{{ formatCurrency(totalManoObra) }}</td>
                  <td>{{ percentOfTotal(totalManoObra) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('costs.summaryTransport') }}</td>
                  <td>{{ formatCurrency(totalTransporteMateriaPrima) }}</td>
                  <td>{{ percentOfTotal(totalTransporteMateriaPrima) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('costs.summaryStorage') }}</td>
                  <td>{{ formatCurrency(totalAlmacenamiento) }}</td>
                  <td>{{ percentOfTotal(totalAlmacenamiento) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('costs.summaryProcessing') }}</td>
                  <td>{{ formatCurrency(totalProcesamiento) }}</td>
                  <td>{{ percentOfTotal(totalProcesamiento) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('costs.summaryOther') }}</td>
                  <td>{{ formatCurrency(totalOtrosCostos) }}</td>
                  <td>{{ percentOfTotal(totalOtrosCostos) }}</td>
                </tr>
                <tr class="total-row">
                  <td>{{ $t('costs.summaryTotal') }}</td>
                  <td>{{ formatCurrency(totalLote) }}</td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="summary-cards-col">
            <div class="summary-card">
              <div class="summary-label">{{ $t('costs.summaryTotalLot') }}</div>
              <div class="summary-value">{{ formatCurrency(totalLote) }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">{{ $t('costs.summaryPerKg') }}</div>
              <div class="summary-value">{{ formatCurrency(costPerKg) }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">{{ $t('costs.summaryPerCup') }}</div>
              <div class="summary-value">{{ formatCurrency(costPerCup) }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="step === 4">
        <div>
          <div v-if="showSuccess" class="success-banner">
            <strong>{{ $t('costs.successTitle') }}</strong><br />
            <span>{{ $t('costs.successCode') }}: {{ registroCodigo }}</span>
          </div>
          <div class="summary-flex-row">
            <div class="summary-cards-col left">
              <div class="summary-card">
                <div class="summary-label">{{ $t('costs.summaryPerKg') }}</div>
                <div class="summary-value big">{{ formatCurrency(costPerKg) }}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">{{ $t('costs.potentialMargin') }}</div>
                <div class="summary-value big">{{ margenPotencial }}%</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">{{ $t('costs.suggestedPrice') }}</div>
                <div class="summary-value big">{{ formatCurrency(precioSugerido) }}/kg</div>
              </div>
            </div>
            <div class="recommendations-block">
              <div class="recommendations-title">{{ $t('costs.recommendations') }}</div>
              <div v-for="rec in recomendaciones" :key="rec.text" :class="['recommendation', rec.type]">
                <span class="icon" :style="{ color: rec.color }">&#10003;</span>
                <span>{{ rec.text }}</span>
              </div>
            </div>
          </div>
          <div class="actions-row center">
            <button class="cancel-btn" @click="salir">{{ $t('costs.exit') }}</button>
            <button class="save-btn" @click="imprimirReporte">{{ $t('costs.printReport') }}</button>
          </div>
        </div>
      </template>
    </div>
    <div class="actions-row">
      <template v-if="step === 1">
        <button class="cancel-btn" @click="cancel">{{ $t('costs.cancel') }}</button>
        <button class="continue-btn" @click="handleContinue">{{ $t('costs.continue') }}</button>
      </template>
      <template v-else-if="step === 2">
        <button class="cancel-btn" @click="prevStep">{{ $t('costs.prev') }}</button>
        <button class="continue-btn" @click="handleContinue">{{ $t('costs.continue') }}</button>
      </template>
      <template v-else-if="step === 3">
        <button class="cancel-btn" @click="prevStep">{{ $t('costs.prev') }}</button>
        <button class="save-btn" @click="guardarYAvanzar">Guardar registro</button>
      </template>
      <template v-else-if="step === 4">
        <button class="cancel-btn" @click="prevStep">{{ $t('costs.prev') }}</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeaderBar from "../../public/components/headerBar.vue";
import api from '../../shared/services/api'

const step = ref(1)
const lote = ref('')
const loteSeleccionado = ref(false)
const showSuccess = ref(false)
const registroCodigo = ref('')

// Paso 2: Costos directos
const costoKgCafeVerde = ref('')
const cantidadCafeVerde = ref('')
const horasTrabajadas = ref('')
const costoPorHora = ref('')
const numeroTrabajadores = ref('')
const costoTransporteKgCafeVerde = ref('')
const cantidadTransporteCafeVerde = ref('')
const energiaElectrica = ref('')
const mantenimientoMaquinaria = ref('')
const insumosProcesamiento = ref('')
const aguaUtilizada = ref('')
const depreciacionEquipos = ref('')
const diasAlmacen = ref('')
const costoDiarioAlmacen = ref('')
const controlCalidad = ref('')
const certificaciones = ref('')
const seguros = ref('')
const gastosAdministrativos = ref('')

const totalMateriaPrima = computed(() => {
  const costo = parseFloat(costoKgCafeVerde.value)
  const cantidad = parseFloat(cantidadCafeVerde.value)
  if (isNaN(costo) || isNaN(cantidad)) return ''
  return (costo * cantidad).toFixed(2)
})
const totalManoObra = computed(() => {
  const horas = parseFloat(horasTrabajadas.value)
  const costoHora = parseFloat(costoPorHora.value)
  const nTrab = parseFloat(numeroTrabajadores.value)
  if (isNaN(horas) || isNaN(costoHora) || isNaN(nTrab)) return ''
  return (horas * costoHora * nTrab).toFixed(2)
})
const totalTransporteMateriaPrima = computed(() => {
  const costo = parseFloat(costoTransporteKgCafeVerde.value)
  const cantidad = parseFloat(cantidadTransporteCafeVerde.value)
  if (isNaN(costo) || isNaN(cantidad)) return ''
  return (costo * cantidad).toFixed(2)
})
const totalAlmacenamiento = computed(() => {
  const dias = parseFloat(diasAlmacen.value)
  const costo = parseFloat(costoDiarioAlmacen.value)
  if (isNaN(dias) || isNaN(costo)) return ''
  return (dias * costo).toFixed(2)
})
const totalProcesamiento = computed(() => {
  const e = parseFloat(energiaElectrica.value) || 0
  const m = parseFloat(mantenimientoMaquinaria.value) || 0
  const i = parseFloat(insumosProcesamiento.value) || 0
  const a = parseFloat(aguaUtilizada.value) || 0
  const d = parseFloat(depreciacionEquipos.value) || 0
  return e + m + i + a + d
})
const totalOtrosCostos = computed(() => {
  const c = parseFloat(controlCalidad.value) || 0
  const cert = parseFloat(certificaciones.value) || 0
  const s = parseFloat(seguros.value) || 0
  const g = parseFloat(gastosAdministrativos.value) || 0
  return c + cert + s + g
})
const totalLote = computed(() => {
  return [
    parseFloat(totalMateriaPrima.value) || 0,
    parseFloat(totalManoObra.value) || 0,
    parseFloat(totalTransporteMateriaPrima.value) || 0,
    parseFloat(totalAlmacenamiento.value) || 0,
    totalProcesamiento.value,
    totalOtrosCostos.value
  ].reduce((a, b) => a + b, 0)
})
const costPerKg = computed(() => {
  const cantidad = parseFloat(cantidadCafeVerde.value) || 0
  if (!cantidad) return 0
  return totalLote.value / cantidad
})
const costPerCup = computed(() => {
  const cantidad = parseFloat(cantidadCafeVerde.value) || 0
  if (!cantidad) return 0
  return totalLote.value / (cantidad * 50)
})

const margenPotencial = computed(() => {
  // Ejemplo: margen del 45% sobre el costo por kg
  if (!costPerKg.value) return 0
  return 45
})
const precioSugerido = computed(() => {
  // Ejemplo: precio sugerido = costo por kg * 1.45
  if (!costPerKg.value) return 0
  return (costPerKg.value * 1.45).toFixed(2)
})

const recomendaciones = computed(() => {
  const recs = []
  const matPrimaPct = parseFloat(percentOfTotal(totalMateriaPrima.value))
  const transpPct = parseFloat(percentOfTotal(totalTransporteMateriaPrima.value))
  const margen = margenPotencial.value
  if (matPrimaPct > 55) {
    recs.push({
      text: $t('costs.recRawMaterialHigh'),
      type: 'blue',
      color: '#1976d2'
    })
  }
  if (transpPct > 10) {
    recs.push({
      text: $t('costs.recTransportHigh'),
      type: 'yellow',
      color: '#fbc02d'
    })
  }
  if (margen >= 40) {
    recs.push({
      text: $t('costs.recMarginHealthy'),
      type: 'green',
      color: '#388e3c'
    })
  } else {
    recs.push({
      text: $t('costs.recMarginLow'),
      type: 'red',
      color: '#d32f2f'
    })
  }
  return recs
})

function handleContinue() {
  if (step.value === 1 && !loteSeleccionado.value) {
    if (lote.value && lote.value.trim() !== '') {
      loteSeleccionado.value = true
    }
  } else if (step.value === 1 && loteSeleccionado.value) {
    step.value++
  } else if (step.value < 4) {
    step.value++
  }
}

function nextStep() {
  if (step.value < 4) step.value++
}
function prevStep() {
  if (step.value > 1) step.value--
}
function cancel() {
  step.value = 1
  lote.value = ''
  loteSeleccionado.value = false
  costoKgCafeVerde.value = ''
  cantidadCafeVerde.value = ''
  horasTrabajadas.value = ''
  costoPorHora.value = ''
  numeroTrabajadores.value = ''
  costoTransporteKgCafeVerde.value = ''
  cantidadTransporteCafeVerde.value = ''
  energiaElectrica.value = ''
  mantenimientoMaquinaria.value = ''
  insumosProcesamiento.value = ''
  aguaUtilizada.value = ''
  depreciacionEquipos.value = ''
  diasAlmacen.value = ''
  costoDiarioAlmacen.value = ''
  controlCalidad.value = ''
  certificaciones.value = ''
  seguros.value = ''
  gastosAdministrativos.value = ''
}

function formatCurrency(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return '$0.00'
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}
function percentOfTotal(val) {
  const n = parseFloat(val)
  if (isNaN(n) || !totalLote.value) return '0%'
  return Math.round((n / totalLote.value) * 100) + '%'
}

function guardarYAvanzar() {
  guardarRegistro();
  setTimeout(() => {
    showSuccess.value = true;
    registroCodigo.value = generarCodigoRegistro();
    step.value = 4;
  }, 100);
}

async function saveCostRecord() {
  try {
    const recordToSave = {
      fecha: new Date().toISOString(),
      lote: lote.value,
      materiaPrima: totalMateriaPrima.value.toFixed(2),
      manoObra: totalManoObra.value.toFixed(2),
      transporte: totalTransporteMateriaPrima.value.toFixed(2),
      almacenamiento: totalAlmacenamiento.value.toFixed(2),
      procesamiento: totalProcesamiento.value,
      otrosCostos: totalOtrosCostos.value,
      totales: {
        totalLote: totalLote.value,
        costPerKg: costPerKg.value,
        costPerCup: costPerCup.value,
      },
      detalle: {
        costoKgCafeVerde: parseFloat(costoKgCafeVerde.value),
        cantidadCafeVerde: parseFloat(cantidadCafeVerde.value),
        horasTrabajadas: parseFloat(horasTrabajadas.value),
        costoPorHora: parseFloat(costoPorHora.value),
        numeroTrabajadores: parseFloat(numeroTrabajadores.value),
        costoTransporteKgCafeVerde: parseFloat(costoTransporteKgCafeVerde.value),
        cantidadTransporteCafeVerde: parseFloat(cantidadTransporteCafeVerde.value),
        energiaElectrica: parseFloat(energiaElectrica.value),
        mantenimientoMaquinaria: parseFloat(mantenimientoMaquinaria.value),
        insumosProcesamiento: parseFloat(insumosProcesamiento.value),
        aguaUtilizada: parseFloat(aguaUtilizada.value),
        depreciacionEquipos: parseFloat(depreciacionEquipos.value),
        diasAlmacen: parseFloat(diasAlmacen.value),
        costoDiarioAlmacen: parseFloat(costoDiarioAlmacen.value),
        controlCalidad: parseFloat(controlCalidad.value),
        certificaciones: parseFloat(certificaciones.value),
        seguros: parseFloat(seguros.value),
        gastosAdministrativos: parseFloat(gastosAdministrativos.value),
      }
    };

    const response = await api.post('/costosLote', recordToSave);

    if (response.status === 201) {
      registroCodigo.value = response.data.id; // Assuming the API returns the created record with an id
      showSuccess.value = true;
      setTimeout(() => {
        router.push({ name: 'home' }); // Redirect to home or another page
      }, 3000); // Redirect after 3 seconds
    } else {
      console.error('Error saving cost record:', response);
      alert('Error al guardar el registro de costos.');
    }
  } catch (error) {
    console.error('Error saving cost record:', error);
    alert('Error al guardar el registro de costos.');
  }
}

function generarCodigoRegistro() {
  // Ejemplo: RC-2024- + 6 dígitos aleatorios
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `RC-2024-${rand}`
}

function salir() {
  // Redirige al dashboard o pantalla principal
  window.location.href = '/';
}
function imprimirReporte() {
  window.print();
}

onMounted(() => {
  document.body.classList.add('cupping-mode')
})
onUnmounted(() => {
  document.body.classList.remove('cupping-mode')
})
</script>

<style scoped>
.cost-register-view {
  background: #f7f6ef;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding: 0 0 40px 0;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #6e8c82;
  padding: 18px 40px 18px 24px;
}
.logo {
  color: white;
  font-weight: bold;
  font-size: 20px;
}
.spacer {
  flex: 1;
}
.breadcrumb {
  font-size: 22px;
  margin: 40px 0 24px 60px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}
.chevron {
  color: #888;
  font-size: 20px;
}
.steps-row {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 12px;
}
.step-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 36px;
  font-size: 20px;
  color: #555;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  font-weight: 500;
  transition: box-shadow 0.2s;
}
.step-card.active {
  border: 2px solid #6e8c82;
  color: #2d3a2e;
  box-shadow: 0 6px 18px rgba(110,140,130,0.13);
}
.progress-bar {
  width: 60vw;
  max-width: 800px;
  height: 6px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 0 auto 32px auto;
  position: relative;
}
.progress {
  height: 100%;
  background: #444;
  border-radius: 4px;
  transition: width 0.3s;
}
.step-content {
  text-align: center;
  margin: 40px 0 30px 0;
}
.step-content h2 {
  font-size: 38px;
  color: #49543b;
  margin-bottom: 32px;
  text-align: center;
  font-weight: 700;
}
.input-lote {
  width: 60%;
  max-width: 600px;
  font-size: 28px;
  padding: 18px 24px;
  border-radius: 12px;
  border: 2px solid #444;
  margin: 0 auto;
  display: block;
  background: #fff;
  color: #444;
}
.actions-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}
.cancel-btn, .continue-btn {
  background: #444d39;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 20px;
  padding: 12px 38px;
  font-weight: 500;
  box-shadow: 2px 4px 8px rgba(0,0,0,0.10);
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn {
  background: #5e5e4d;
}
.cancel-btn:hover, .continue-btn:hover {
  background: #2d3a2e;
}
.costs-row {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-bottom: 30px;
}
.cost-card {
  flex: 1;
  min-width: 340px;
  background: #fff;
  border: 2px solid #444;
  border-radius: 16px;
  padding: 28px 24px 18px 24px;
  margin: 0 10px;
}
.cost-card h3 {
  font-size: 26px;
  color: #49543b;
  margin-bottom: 18px;
  font-weight: 700;
}
.cost-fields {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.cost-fields > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 180px;
  margin-bottom: 12px;
}
.cost-fields label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
}
.cost-fields input {
  font-size: 18px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  background: #fff;
  color: #333;
}
.readonly {
  background: #ccc;
  color: #444;
  font-weight: 600;
}
.selected-lot-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}
.selected-lot-label {
  font-weight: 600;
  color: #444;
  font-size: 20px;
}
.selected-lot-value {
  font-size: 20px;
  color: #2d3a2e;
  background: #e0e0e0;
  padding: 6px 18px;
  border-radius: 8px;
}
.change-lot-btn {
  background: #fff;
  color: #444d39;
  border: 1.5px solid #444d39;
  border-radius: 8px;
  font-size: 16px;
  padding: 6px 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.change-lot-btn:hover {
  background: #444d39;
  color: #fff;
}
.costs-directos-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 30px;
}
.costs-row-top {
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 18px;
}
.costs-row-bottom {
  display: flex;
  flex-direction: row;
  gap: 32px;
}
.cost-card.exact {
  background: #fff;
  border: 2.5px solid #222;
  border-radius: 16px;
  box-shadow: none;
  padding: 24px 24px 18px 24px;
  min-width: 500px;
  max-width: 650px;
  flex: 1 1 0;
}
.storage-card.exact {
  min-width: 500px;
  max-width: 650px;
  background: #fff;
  border: 2.5px solid #222;
  border-radius: 16px;
  box-shadow: none;
  padding: 24px 24px 18px 24px;
  flex: 1 1 0;
}
.indirect-card.exact {
  min-width: 380px;
  max-width: 420px;
  background: #fcfcfa;
  border: 2px solid #e0e0e0;
}
.cost-card.exact h3 {
  font-size: 26px;
  color: #222;
  font-weight: 700;
  margin-bottom: 18px;
  text-align: left;
}
.cost-fields-horizontal {
  display: flex;
  flex-direction: row;
  gap: 18px;
  align-items: flex-end;
}
.cost-fields-horizontal > div {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 160px;
  margin-bottom: 0;
}
.cost-fields-horizontal label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
  text-align: left;
}
.cost-fields-horizontal input {
  font-size: 18px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  background: #fff;
  color: #333;
}
.cost-fields-horizontal.processing {
  flex-wrap: wrap;
  gap: 18px 24px;
}
.cost-fields-horizontal.processing > div {
  min-width: 220px;
  margin-bottom: 12px;
}
.cost-fields-horizontal.indirect {
  flex-wrap: wrap;
  gap: 18px 24px;
}
.cost-fields-horizontal.indirect > div {
  min-width: 180px;
  margin-bottom: 12px;
}
.admin-expense {
  flex-basis: 100%;
  min-width: 100%;
}
.admin-expense label {
  margin-top: 8px;
}
.summary-layout {
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  margin: 40px 0 0 0;
}
.summary-table-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 0 0 0;
  min-width: 520px;
  max-width: 600px;
  flex: 2;
}
.summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
}
.summary-table th, .summary-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 18px;
  text-align: left;
  color: #222;
  background: #fff;
}
.summary-table th {
  background: #f5f5f5;
  font-weight: 700;
  font-size: 18px;
  color: #222;
}
.summary-table .total-row td {
  font-weight: 700;
  background: #f5f5f5;
  color: #222;
}
.summary-cards-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 220px;
  max-width: 260px;
  flex: 1;
}
.summary-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid #f0f0f0;
}
.summary-label {
  font-size: 16px;
  color: #888;
  margin-bottom: 6px;
}
.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #444d39;
}
.save-btn {
  background: #444d39;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 20px;
  padding: 12px 38px;
  font-weight: 500;
  box-shadow: 2px 4px 8px rgba(0,0,0,0.10);
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:hover {
  background: #2d3a2e;
}
.summary-table ::selection, .summary-table th::selection, .summary-table td::selection {
  background: #1976d2;
  color: #fff;
}
.success-banner {
  background: #b48c6e;
  color: #222;
  font-size: 22px;
  text-align: center;
  padding: 18px 0 8px 0;
  border-radius: 8px;
  margin: 18px auto 24px auto;
  max-width: 900px;
  font-weight: 700;
  border: 2px solid #7c624a;
}
.recommendations-block {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 24px;
  min-width: 340px;
  max-width: 520px;
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid #f0f0f0;
}
.recommendations-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #222;
}
.recommendation {
  display: flex;
  align-items: center;
  font-size: 17px;
  margin-bottom: 14px;
  padding-left: 4px;
  font-weight: 500;
}
.recommendation .icon {
  font-size: 22px;
  margin-right: 10px;
  font-weight: bold;
}
.summary-cards-col.left {
  margin-right: 32px;
  min-width: 220px;
  max-width: 260px;
  flex: 1;
}
.summary-card .summary-value.big {
  font-size: 32px;
  font-weight: 700;
  color: #444d39;
}
.summary-flex-row {
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  margin: 40px 0 0 0;
}
.actions-row.center {
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  display: flex;
}
</style> 