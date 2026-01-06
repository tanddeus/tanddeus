<template>
  <TheHeaderSmallScreens v-if="showSmScreenHeader" />
  <TheHeaderLargeScreens v-else />
</template>

<script setup lang="ts">
const screenDimensions = useScreenDimensions();
const showSmScreenHeader = computed(() => {
  return screenDimensions.width < 1000;
}); //
</script>
