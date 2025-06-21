<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
      validator: (items) => {
        return items.every((item) => item.label && (item.path !== undefined));
      }
    }
  }
};
</script>

<template>
  <div class="breadcrumb">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <template v-if="index < items.length - 1">
          <router-link :to="item.path">{{ item.label }}</router-link>
          <span class="separator">&gt;</span>
        </template>
        <template v-else>
          <span class="current">{{ item.label }}</span>
        </template>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.breadcrumb {
  padding: 1rem 2rem;
  background-color: transparent;
  margin-bottom: 1rem;
}

.breadcrumb ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
}

.breadcrumb li {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  color: #3C4B3A;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}

.breadcrumb a:hover {
  color: #c38757;
  text-decoration: underline;
}

.breadcrumb .current {
  color: #666;
  font-weight: 500;
}

.separator {
  margin: 0 8px;
  color: #999;
  font-weight: 500;
}
</style> 