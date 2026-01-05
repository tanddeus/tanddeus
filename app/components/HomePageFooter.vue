<template>
  <footer class="footer">
    <a :href="INSTAGRAM_URL" target="_blank" rel="noreferrer" class="link">
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
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  opacity: 0;
  padding: 35px;
  position: absolute;
  width: 100%;
}

.link {
  display: block;
  padding: 2.5px;
}

.icon {
  height: 30px;
  width: 30px;
}
</style>
