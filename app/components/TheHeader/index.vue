<template>
  <div v-if="showHeader">
    <TheHeaderSpacer />
    <TheHeaderResponsive />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const showHeader = computed(() => {
  return route.path !== '/';
});
</script>
