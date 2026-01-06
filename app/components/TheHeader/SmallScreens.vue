<template>
  <header class="header">
    <svg ref="svgRef" class="header__background"></svg>
    <NuxtLink to="/">
      <img
        ref="titleRef"
        src="/images/components/hero/title.svg"
        alt="Go to the Tanddeus home page"
        class="header__title"
    /></NuxtLink>
    <HamburgerButton />
  </header>
</template>

<script setup lang="ts">
import { BackgroundRenderer } from './background-renderer';

const svgRef = ref<SVGElement | null>(null);
const titleRef = ref<HTMLImageElement | null>(null);
const backgroundRendererRef = ref<BackgroundRenderer | null>(null);

onMounted(() => {
  const getOrigin = (svgWidth: number) => {
    const {
      top: titleElementTop,
      left: titleElementLeft,
      width: titleElementWidth,
      height: titleElementHeight,
    } = titleRef.value!.getBoundingClientRect();

    /* 
      Because there is a faint glow around the title, the actual position 
      of the top of the letters is a bit inset from the top of the element. 
      The position of the letter A would have to be 
        calculated regardless.
    */
    const titleTextTop = titleElementTop + 0.046 * titleElementHeight;
    const letterALeft = titleElementLeft + 0.1735 * titleElementWidth;

    return {
      x: letterALeft,
      y: titleTextTop,
    };
  };

  backgroundRendererRef.value = new BackgroundRenderer(
    svgRef.value!,
    getOrigin,
  );

  backgroundRendererRef.value.drawBackground();
});

onActivated(() => {
  backgroundRendererRef.value?.watchForResize();
});

onDeactivated(() => {
  backgroundRendererRef.value?.stopWatchingForResize();
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/partials' as *;

.header {
  position: relative;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $color-teal;
  padding-left: 12.5px;
}

.header__background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}

.header__title {
  height: 35px;
}
</style>
