<template>
  <main class="page">
    <Hero
      :lines-animation-duration="linesAnimationDuration"
      :lines-animation-easing-function="linesAnimationEasingFunction"
      :fade-animation-duration="fadeAnimationDuration"
      :fade-animation-easing-function="fadeAnimationEasingFunction"
      :initial-delay="initialDelay"
    />
    <HomePageFooter
      :fade-in-delay="footerDelay"
      :fade-in-duration="fadeAnimationDuration"
      :fade-in-easing-function="fadeAnimationEasingFunction"
    />
  </main>
</template>

<script setup lang="ts">
import { Temporal } from 'temporal-polyfill';

const linesAnimationDuration = Temporal.Duration.from({ milliseconds: 750 });
const linesAnimationEasingFunction = 'power3.inOut';
const fadeAnimationDuration = Temporal.Duration.from({ milliseconds: 1000 });
const fadeAnimationEasingFunction = 'sine.out';
const initialDelay = Temporal.Duration.from({ milliseconds: 200 });
const footerDelay = Temporal.Duration.from({
  milliseconds:
    linesAnimationDuration.total('milliseconds') +
    initialDelay.total('milliseconds'),
});
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  position: relative;
}

.hero {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
