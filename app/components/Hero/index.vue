<template>
  <div class="hero">
    <svg ref="svgRef" class="hero__background"></svg>
    <div class="hero__title-container">
      <img
        ref="titleRef"
        src="/images/components/hero/title.svg"
        alt="Tanddeus"
        role="heading"
        aria-level="1"
        class="hero__title"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Temporal } from 'temporal-polyfill';
import { BackgroundAnimationManager } from './background-animation-manager';

const { $gsap } = useNuxtApp();
const svgRef = ref<SVGElement | null>(null);
const titleRef = ref<HTMLImageElement | null>(null);
const linesAnimationDuration = Temporal.Duration.from({ milliseconds: 750 });
const linesAnimationEasingFunction = 'power3.inOut';
const fadeAnimationDuration = Temporal.Duration.from({ milliseconds: 1000 });
const fadeAnimationEasingFunction = 'sine.out';

onMounted(() => {
  const backgroundAnimationManager = new BackgroundAnimationManager(
    svgRef.value!,
    (svgWidth: number) => {
      const {
        top: titleElementTop,
        left: titleElementLeft,
        width: titleElementWidth,
        height: titleElementHeight,
      } = titleRef.value!.getBoundingClientRect();

      /* 
        Because there is a faint glow around the title, the actual position 
        of the top / left of the letters is a bit inset from the top and left 
        of the element. The position of the letter A would have to be 
        calculated regardless.
      */
      const titleTextTop = titleElementTop + 0.046 * titleElementHeight;
      const letterTLeft = titleElementLeft + 0.005 * titleElementWidth;
      const letterALeft = titleElementLeft + 0.1735 * titleElementWidth;
      const tabletBreakpoint = 768;

      return {
        x:
          titleElementLeft + svgWidth > tabletBreakpoint ?
            letterTLeft
          : letterALeft,
        y: titleTextTop,
      };
    },
    linesAnimationDuration,
    linesAnimationEasingFunction,
    fadeAnimationDuration,
    fadeAnimationEasingFunction,
  );

  backgroundAnimationManager.beginAnimation();

  $gsap.to('.hero__title-container', {
    opacity: 1,
    delay: linesAnimationDuration.total('seconds'),
    duration: fadeAnimationDuration.total('seconds'),
    ease: fadeAnimationEasingFunction,
  });
});
</script>

<style lang="scss" scoped>
.hero {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
}

.hero__background {
  display: block;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.hero__title-container {
  opacity: 0;
  padding: 32px;
}

.hero__title {
  max-width: 900px;
  width: 100%;
}
</style>
