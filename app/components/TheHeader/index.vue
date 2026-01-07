<template>
  <Transition name="the-header">
    <div v-if="showHeader">
      <TheHeaderResponsive />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const route = useRoute();
const showHeader = computed(() => {
  console.log(showHeader);
  return route.path !== '/';
});
</script>

<style lang="scss">
.the-header-enter-active {
  transition: opacity 150ms ease-out 150ms;
}

.the-header-leave-active {
  transition: opacity 150ms ease-out;
}

.the-header-enter-from,
.the-header-leave-to {
  opacity: 0;
}

.the-header-enter-to,
.the-header-leave-from {
  opacity: 1;
}
</style>
