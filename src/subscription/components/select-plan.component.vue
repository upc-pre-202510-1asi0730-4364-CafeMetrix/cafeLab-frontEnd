<template>
  <div class="plan-container">
    <h1>Escoge tu plan</h1>

    <div class="plans">
      <div class="plan-card">
        <h2>Plan Barista</h2>
        <div class="plan-price">$9.99/mes</div>
        <ul class="features">
          <li>Dashboard personalizado para baristas</li>
          <li>Seguimiento de recetas</li>
          <li>Gestión básica de horarios</li>
        </ul>
        <button class="select-btn" @click="selectPlan('barista')">Seleccionar Plan</button>
      </div>

      <div class="plan-card">
        <h2>Plan Dueño/Administrador</h2>
        <div class="plan-price">$19.99/mes</div>
        <ul class="features">
          <li>Dashboard para propietarios</li>
          <li>Gestión de personal</li>
          <li>Reportes básicos de ventas</li>
        </ul>
        <button class="select-btn" @click="selectPlan('admin')">Seleccionar Plan</button>
      </div>

      <div class="plan-card premium">
        <div class="recommended-badge">Recomendado</div>
        <h2>Plan Completo</h2>
        <div class="plan-price">$29.99/mes</div>
        <ul class="features">
          <li>Dashboard premium completo</li>
          <li>Todas las funciones de barista y dueño</li>
          <li>Reportes avanzados y análisis</li>
          <li>Soporte prioritario 24/7</li>
          <li>Actualizaciones exclusivas</li>
        </ul>
        <button class="select-btn premium-btn" @click="selectPlan('complete')">Seleccionar Plan</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SelectPlan',
  methods: {
    async selectPlan(planType) {
      try {
        // Guardar el plan seleccionado en localStorage
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.plan = planType;
          user.hasPlan = true;

          // Guardar en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));

          // También guardar en el servidor
          try {
            await axios.put(`http://localhost:3000/users/${user.id}`, user);
            console.log('Plan guardado exitosamente:', planType);
          } catch (error) {
            console.error('Error al guardar plan en servidor:', error);
          }

          // Redirigir según el plan seleccionado
          if (planType === 'complete') {
            // Si es plan completo, ir al dashboard completo
            this.$router.push('/complete-dashboard');
          } else if (user.role === 'barista') {
            // Si es barista con otro plan, ir al dashboard de barista
            this.$router.push('/barista-home');
          } else {
            // Si es dueño con otro plan, ir al dashboard de dueño
            this.$router.push('/owner-home');
          }
        }
      } catch (error) {
        console.error('Error al seleccionar plan:', error);
      }
    }
  }
}
</script>

<style scoped>
.plan-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: #f8f8f8;
  min-height: 100vh;
}

h1 {
  margin-bottom: 3rem;
  color: #4c4c3d;
  font-size: 2.5rem;
  font-weight: 700;
}

.plans {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.plan-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 300px;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  border: 1px solid #eaeaea;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.plan-card.premium {
  border: 2px solid #4c4c3d;
  transform: scale(1.05);
  z-index: 1;
}

.plan-card.premium:hover {
  transform: scale(1.05) translateY(-8px);
}

.recommended-badge {
  position: absolute;
  top: -12px;
  right: -12px;
  background-color: #4c4c3d;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

h2 {
  color: #4c4c3d;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.plan-price {
  color: #666;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.features {
  list-style-type: none;
  padding: 0;
  margin-bottom: 2rem;
  text-align: left;
  min-height: 150px;
}

.features li {
  padding: 0.6rem 0;
  color: #555;
  font-size: 1rem;
}

.features li:before {
  content: "✓";
  color: #4c4c3d;
  margin-right: 0.5rem;
  font-weight: bold;
}

.select-btn {
  background-color: #4c4c3d;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
  width: 100%;
}

.select-btn:hover {
  background-color: #3a3a2e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.premium-btn {
  background-color: #5a5a47;
}

.premium-btn:hover {
  background-color: #4c4c3d;
}

@media (max-width: 768px) {
  .plans {
    flex-direction: column;
    align-items: center;
  }

  .plan-card {
    width: 100%;
    max-width: 350px;
    margin-bottom: 2rem;
  }

  .plan-card.premium {
    transform: none;
    order: -1;
  }

  .plan-card.premium:hover {
    transform: translateY(-8px);
  }
}
</style>