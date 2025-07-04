<template>
  <div class="recipe-card" @click="$emit('click', recipe.id)">
    <div class="recipe-image">
      <img 
        :src="recipe.imageUrl || '/public/vite.svg'" 
        :alt="recipe.name" 
        @error="e => e.target.src = '/public/vite.svg'"
      />
      <div class="recipe-actions" v-if="showActions">
        <button 
          v-if="showView"
          @click.stop="$emit('view', recipe.id)" 
          class="action-btn view-btn"
          title="Ver detalle"
        >
          <i class="pi pi-eye"></i>
        </button>
        <button 
          v-if="showAssign"
          @click.stop="$emit('assign', recipe)" 
          class="action-btn assign-btn"
          title="Asignar a portafolio"
        >
          <i class="pi pi-link"></i>
        </button>
        <button 
          v-if="showRemove"
          @click.stop="$emit('remove', recipe.id)" 
          class="action-btn remove-btn"
          title="Quitar del portafolio"
        >
          <i class="pi pi-times"></i>
        </button>
        <button 
          v-if="showDelete"
          @click.stop="$emit('delete', recipe)" 
          class="action-btn delete-btn"
          title="Eliminar receta"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>
    <div class="recipe-content">
      <h4>{{ recipe.name }}</h4>
      <p v-if="recipe.preparationTime">
        <i class="pi pi-clock"></i>
        {{ recipe.preparationTime + ' mins' }}
      </p>
    </div>
    <div v-if="portfolioName" class="recipe-portfolio-badge">
      <i class="pi pi-folder"></i> {{ portfolioName }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  portfolioName: {
    type: String,
    default: ''
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showView: {
    type: Boolean,
    default: true
  },
  showAssign: {
    type: Boolean,
    default: false
  },
  showRemove: {
    type: Boolean,
    default: false
  },
  showDelete: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click', 'view', 'assign', 'remove', 'delete']);
</script>

<style scoped>
.recipe-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.recipe-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.recipe-card:hover .recipe-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(51, 51, 51, 0.9);
  color: white;
}

.view-btn:hover {
  background-color: #4CAF50;
  transform: scale(1.1);
}

.assign-btn:hover {
  background-color: #2196F3;
  transform: scale(1.1);
}

.remove-btn:hover {
  background-color: #f44336;
  transform: scale(1.1);
}

.delete-btn:hover {
  background-color: #d32f2f;
  transform: scale(1.1);
}

.recipe-content {
  padding: 16px;
}

.recipe-content h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.recipe-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.recipe-portfolio-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style> 