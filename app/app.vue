<template>
  <NuxtPage keepalive />
  <NuxtRouteAnnouncer />
  <TheFooter v-if="showFooter" />
</template>

<script setup lang="ts">
const route = useRoute();
const showFooter = computed(() => {
  return route.path !== '/';
});
</script>

<style lang="scss">
@use '~/assets/scss/main';
</style>
