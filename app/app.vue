<template>
  <TheHeader />
  <NuxtPage :page-transition="pageTransition"></NuxtPage>
  <NuxtRouteAnnouncer />
</template>

<script setup lang="ts">
const { $gsap } = useNuxtApp();
const routeTransitionsStore = useRouteTransitionsStore();
const screenDimensions = useScreenDimensions();

const pageTransition = {
  name: 'page',
  mode: 'out-in',
  css: false,
  onEnter: (el: Element, done: () => void) => {
    if (routeTransitionsStore.from === '/' || screenDimensions.width >= 1000) {
      $gsap
        .to(el, {
          opacity: 1,
          duration: 0.15,
          ease: 'sine.out',
        })
        .then(done);
    }
  },
  onLeave: (el: Element, done: () => void) => {
    if (routeTransitionsStore.to === '/' || screenDimensions.width >= 1000) {
      $gsap
        .to(el, {
          opacity: 0,
          duration: 0.15,
          ease: 'sine.in',
        })
        .then(done);
    }
  },
};
</script>

<style lang="scss">
@use '~/assets/scss/main';
</style>
