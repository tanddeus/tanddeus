<template>
  <header class="header">
    <svg ref="svgRef" class="header__background"></svg>
    <nav class="navigation">
      <ul class="navigation__menu">
        <li class="main-navigation__item">
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li class="main-navigation__item">
          <NuxtLink to="/projects">Projects</NuxtLink>
        </li>
      </ul>
    </nav>

    <NuxtLink to="/">
      <img
        ref="titleRef"
        src="/images/components/hero/title.svg"
        alt="Go to the Tanddeus home page"
        class="header__title"
    /></NuxtLink>
    <nav class="navigation">
      <ul class="navigation__menu secondary-navigation__menu">
        <li>
          <img
            src="/images/shared/icons/instagram.svg"
            alt="Open the Tanddeus Instagram page in a new tab"
            class="icon"
          />
        </li>
      </ul>
    </nav>
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
      of the top / left of the letters is a bit inset from the top and left 
      of the element.
    */
    const titleTextTop = titleElementTop + 0.046 * titleElementHeight;
    const letterTLeft = titleElementLeft + 0.005 * titleElementWidth;

    return {
      x: letterTLeft,
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
}

.header__background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}

.navigation {
  width: 33%;
}

.navigation__menu {
  list-style-type: none;
  margin: 0;
  padding: 0 20px;
  display: flex;
}

.main-navigation__item:has(+ .main-navigation__item) {
  margin-right: 50px;
}

.secondary-navigation__menu {
  justify-content: flex-end;
}

.header__title {
  height: 35px;
}
</style>
