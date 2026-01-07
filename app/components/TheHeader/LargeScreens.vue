<template>
  <header class="header">
    <svg ref="svgRef" class="header__background" />
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
          <a
            :href="INSTAGRAM_URL"
            target="_blank"
            rel="noreferrer"
            class="secondary-navigation__link"
          >
            <img
              src="/images/shared/icons/instagram.svg"
              alt="Open the Tanddeus Instagram page in a new tab"
              class="secondary-navigation__icon"
          /></a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { BackgroundRenderer } from './background-renderer';
import { INSTAGRAM_URL } from '~/shared';

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
  backgroundRendererRef.value?.watchForResize();
});

onUnmounted(() => {
  backgroundRendererRef.value?.stopWatchingForResize();
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/partials' as *;
@use './styles' as *;

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $color-teal;
  background-color: $color-dark-gray;
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

.header__title {
  height: 35px;
}

.secondary-navigation__menu {
  justify-content: flex-end;
}

.secondary-navigation__link {
  display: block;
  padding: 2.5px;
}

.secondary-navigation__icon {
  height: 30px;
  width: 30px;
}
</style>
