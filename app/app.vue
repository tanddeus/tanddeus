<template>
  <TheHeader />
  <NuxtPage keepalive />
  <NuxtRouteAnnouncer />
</template>

<style lang="scss">
@use '~/assets/scss/main';
.page-leave-active {
  transition: opacity 150ms ease-in;
}

.page-enter-active {
  transition: opacity 150ms ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
