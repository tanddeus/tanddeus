<template>
  <div class="hero">
    <svg ref="svgRef" class="hero__background"></svg>
    <div class="hero__title-container">
      <img
        src="/images/components/hero/title.svg"
        alt="Tanddeus"
        role="heading"
        aria-level="1"
        class="hero__title"
        ref="titleRef"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Temporal } from 'temporal-polyfill';
import { BackgroundAnimationManager } from './background-animation-manager';

const svgRef = ref<SVGElement | null>(null);
const titleRef = ref<HTMLImageElement | null>(null);

onMounted(() => {
  const backgroundAnimationManager = new BackgroundAnimationManager(
    svgRef.value!,
    (svgWidth: number, svgHeight: number) => {
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
    Temporal.Duration.from({ milliseconds: 1000 }),
    'power3.inOut',
    Temporal.Duration.from({ milliseconds: 1000 }),
    'power4.out',
  );

  backgroundAnimationManager.beginAnimation();
});
</script>

<style>
.hero {
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: block;
}

.hero__title-container {
  padding: 32px;
}

.hero__title {
  width: 100%;
  max-width: 900px;
}
</style>
