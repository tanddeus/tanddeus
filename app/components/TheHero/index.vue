<template>
  <div class="hero">
    <svg ref="svgRef" class="hero__background"></svg>
    <div class="hero__title-container">
      <div class="hero__logo-wrapper" ref="logoWrapperRef">
        <picture>
          <source
            srcset="
              /images/components/hero/title/avif/title_900w_v1.avif  1x,
              /images/components/hero/title/avif/title_1350w_v1.avif 1.5x,
              /images/components/hero/title/avif/title_1800w_v1.avif 2x,
              /images/components/hero/title/avif/title_2700w_v1.avif 3x,
              /images/components/hero/title/avif/title_3600w_v1.avif 4x,
              /images/components/hero/title/avif/title_900w_v1.avif
            "
            type="image/avif"
          />
          <source
            srcset="
              /images/components/hero/title/webp/title_900w_v1.webp  1x,
              /images/components/hero/title/webp/title_1350w_v1.webp 1.5x,
              /images/components/hero/title/webp/title_1800w_v1.webp 2x,
              /images/components/hero/title/webp/title_2700w_v1.webp 3x,
              /images/components/hero/title/webp/title_3600w_v1.webp 4x,
              /images/components/hero/title/webp/title_900w_v1.webp
            "
            type="image/webp"
          />
          <img
            ref="titleRef"
            srcset="
              /images/components/hero/title/png/title_917w_v1.png  1x,
              /images/components/hero/title/png/title_1375w_v1.png 1.5x,
              /images/components/hero/title/png/title_1833w_v1.png 2x,
              /images/components/hero/title/png/title_2749w_v1.png 3x,
              /images/components/hero/title/png/title_3665w_v1.png 4x
            "
            src="/images/components/hero/title/png/title_917w_v1.png"
            alt="Tanddeus"
            role="heading"
            aria-level="1"
            class="hero__title"
          />
        </picture>
      </div>
      <h2 class="hero__subtitle">Web Design and Development</h2>
      <div class="hero__links">
        <NuxtLink to="/about" class="hero__link">About</NuxtLink>
        <NuxtLink to="/projects" class="hero__link">Projects</NuxtLink>
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
const logoWrapperRef = ref<HTMLElement | null>(null);
const backgroundAnimationManagerRef = ref<BackgroundAnimationManager | null>(
  null,
);

onMounted(() => {
  const getOrigin = (svgWidth: number) => {
    const {
      top: titleElementTop,
      left: titleElementLeft,
      width: titleElementWidth,
      height: titleElementHeight,
    } = logoWrapperRef.value!.getBoundingClientRect();

    /* 
        Because there is a faint glow around the title, the actual position 
        of the top / left of the letters is a bit inset from the top and left 
        of the element. The position of the letter A would have to be 
        calculated regardless.
      */
    const titleTextTop = titleElementTop + 0.055 * titleElementHeight;
    const letterTLeft = titleElementLeft + 0.005 * titleElementWidth;
    const letterALeft = titleElementLeft + 0.1765 * titleElementWidth;
    const tabletBreakpoint = 940;

    return {
      x:
        titleElementLeft + svgWidth >= tabletBreakpoint ?
          letterTLeft
        : letterALeft,
      y: titleTextTop,
    };
  };

  backgroundAnimationManagerRef.value = new BackgroundAnimationManager(
    svgRef.value!,
    getOrigin,
    linesAnimationDuration,
    linesAnimationEasingFunction,
    fadeAnimationDuration,
    fadeAnimationEasingFunction,
    initialDelay,
  );

  backgroundAnimationManagerRef.value.beginAnimation();
  backgroundAnimationManagerRef.value?.watchForResize();

  $gsap.to('.hero__title-container', {
    opacity: 1,
    delay:
      linesAnimationDuration.total('seconds') +
      (initialDelay?.total('seconds') ?? 0),
    duration: fadeAnimationDuration.total('seconds'),
    ease: fadeAnimationEasingFunction,
  });
});

onBeforeUnmount(() => {
  backgroundAnimationManagerRef.value?.stopWatchingForResize();
});

// onActivated(() => {
//   backgroundAnimationManagerRef.value?.watchForResize();
// });

// onDeactivated(() => {
//   backgroundAnimationManagerRef.value?.stopWatchingForResize();
// });
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

.hero__logo-wrapper {
  display: block;
  margin-bottom: 50px;
  max-width: 900px;
  width: 100%;
}

.hero__title {
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

.hero__link:hover {
  color: $color-teal;
  text-shadow: 1px 1px 3px #6bdcff40;
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
