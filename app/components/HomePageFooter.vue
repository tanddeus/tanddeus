<template>
  <footer class="footer">
    <a :href="INSTAGRAM_URL" target="_blank" rel="noreferrer">
      <img
        src="/images/shared/icons/instagram.svg"
        alt="Open the Tanddeus Instagram page in a new tab"
        class="icon"
      />
    </a>
  </footer>
</template>

<script setup lang="ts">
import { INSTAGRAM_URL } from '~/shared';
import type { Temporal } from 'temporal-polyfill';

interface HomePageFooterProps {
  fadeInDelay: Temporal.Duration;
  fadeInDuration: Temporal.Duration;
  fadeInEasingFunction: GSAPTweenVars['ease'];
}

const { fadeInDelay, fadeInDuration, fadeInEasingFunction } =
  defineProps<HomePageFooterProps>();
const { $gsap } = useNuxtApp();

onMounted(() => {
  $gsap.to('.footer', {
    opacity: 1,
    delay: fadeInDelay.total('seconds'),
    duration: fadeInDuration.total('seconds'),
    ease: fadeInEasingFunction,
  });
});
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 35px;
  opacity: 0;
}

.icon {
  width: 35px;
  height: 35px;
}
</style>
