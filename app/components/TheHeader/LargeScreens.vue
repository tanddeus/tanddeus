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
  const getOrigin = () => {
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

const scrollbarStatus = useScrollbarStatus();
const paddingLeft = computed(() => {
  return `${scrollbarStatus.scrollbarWidth + 20}px`;
});

const paddingRight = computed(() => {
  return scrollbarStatus.isPageScrollable ? '20px' : (
      `${scrollbarStatus.scrollbarWidth + 20}px`
    );
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/partials' as *;
@use './styles' as *;

.header {
  align-items: center;
  background-color: $color-dark-gray;
  border-bottom: 1px solid $color-teal;
  display: flex;
  height: $header-height;
  justify-content: space-between;
  left: 0;
  padding-left: v-bind(paddingLeft);
  padding-right: v-bind(paddingRight);
  position: fixed;
  top: 0;
  width: 100%;
}

.header__background {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
}

.navigation {
  width: 33%;
}

.navigation__menu {
  display: flex;
  list-style-type: none;
  margin: 0;
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
