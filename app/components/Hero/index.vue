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
      <h2 class="hero__subtitle">Web Design and Development</h2>
      <div class="hero__links">
        <NuxtLink href="/about" class="hero__link">About</NuxtLink>
        <NuxtLink href="/projects" class="hero__link">Projects</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill';
import { BackgroundAnimationManager } from './background-animation-manager';

interface HeroProps {
  linesAnimationDuration: Temporal.Duration;
  linesAnimationEasingFunction: GSAPTweenVars['ease'];
  fadeAnimationDuration: Temporal.Duration;
  fadeAnimationEasingFunction: GSAPTweenVars['ease'];
  initialDelay?: Temporal.Duration;
}

const { $gsap } = useNuxtApp();
const {
  linesAnimationDuration,
  linesAnimationEasingFunction,
  fadeAnimationDuration,
  fadeAnimationEasingFunction,
  initialDelay,
} = defineProps<HeroProps>();

const svgRef = ref<SVGElement | null>(null);
const titleRef = ref<HTMLImageElement | null>(null);

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
      const tabletBreakpoint = 940;

      return {
        x:
          titleElementLeft + svgWidth >= tabletBreakpoint ?
            letterTLeft
          : letterALeft,
        y: titleTextTop,
      };
    },
    linesAnimationDuration,
    linesAnimationEasingFunction,
    fadeAnimationDuration,
    fadeAnimationEasingFunction,
    initialDelay,
  );

  backgroundAnimationManager.beginAnimation();

  $gsap.to('.hero__title-container', {
    opacity: 1,
    delay:
      linesAnimationDuration.total('seconds') +
      (initialDelay?.total('seconds') ?? 0),
    duration: fadeAnimationDuration.total('seconds'),
    ease: fadeAnimationEasingFunction,
  });
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/partials' as *;

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
  z-index: -1;
}

.hero__title-container {
  opacity: 0;
  padding: 0 20px;
}

.hero__title {
  display: block;
  margin-bottom: 50px;
  max-width: 900px;
  width: 100%;
}

.hero__subtitle {
  color: $color-teal;
  font-family: $font-family-roboto-mono;
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 50px;
  text-align: center;
  text-shadow: -1px -1px 10px #6bdcff40;
}

.hero__links {
  display: flex;
  justify-content: center;
}

.hero__link:has(+ .hero__link) {
  margin-right: 100px;
}

@media screen and (width >= 940px) {
  .hero__subtitle {
    font-size: 40px;
  }
}

@media screen and (height <= 430px) {
  .hero__title,
  .hero__subtitle {
    margin-bottom: 30px;
  }
}

@media screen and (height <= 360px) {
  .hero {
    align-items: flex-start;
  }

  .hero__title-container {
    padding-top: 35px;
  }
}
</style>
