<template>
  <header class="header">
    <svg ref="svgRef" class="header__background"></svg>
    <nav class="navigation">
      <ul class="navigation__menu">
        <li class="main-navigation__item">
          <NuxtLink to="/about" class="main-navigation__link">About</NuxtLink>
        </li>
        <li class="main-navigation__item">
          <NuxtLink to="/projects" class="main-navigation__link"
            >Projects</NuxtLink
          >
        </li>
      </ul>
    </nav>

    <NuxtLink to="/">
      <picture>
        <source
          srcset="
            /images/components/the-header/large-screens/logo/avif/logo_300w_v1.avif  1x,
            /images/components/the-header/large-screens/logo/avif/logo_450w_v1.avif  1.5x,
            /images/components/the-header/large-screens/logo/avif/logo_600w_v1.avif  2x,
            /images/components/the-header/large-screens/logo/avif/logo_900w_v1.avif  3x,
            /images/components/the-header/large-screens/logo/avif/logo_1200w_v1.avif 4x,
            /images/components/the-header/large-screens/logo/avif/logo_1200w_v1.avif
          "
          type="image/avif"
        />
        <source
          srcset="
            /images/components/the-header/large-screens/logo/webp/logo_300w_v1.webp  1x,
            /images/components/the-header/large-screens/logo/webp/logo_450w_v1.webp  1.5x,
            /images/components/the-header/large-screens/logo/webp/logo_600w_v1.webp  2x,
            /images/components/the-header/large-screens/logo/webp/logo_900w_v1.webp  3x,
            /images/components/the-header/large-screens/logo/webp/logo_1200w_v1.webp 4x,
            /images/components/the-header/large-screens/logo/webp/logo_1200w_v1.webp
          "
          type="image/webp"
        />
        <!--
        <img
          srcset="
            /images/components/the-header/large-screens/logo/jpeg/logo_300w_v1.jpeg  1x,
            /images/components/the-header/large-screens/logo/jpeg/logo_450w_v1.jpeg  1.5x,
            /images/components/the-header/large-screens/logo/jpeg/logo_600w_v1.jpeg  2x,
            /images/components/the-header/large-screens/logo/jpeg/logo_900w_v1.jpeg  3x,
            /images/components/the-header/large-screens/logo/jpeg/logo_1200w_v1.jpeg 4x,
            /images/components/the-header/large-screens/logo/jpeg/logo_1200w_v1.jpeg
          "
          src="/images/components/the-header/large-screens/logo/jpeg/logo_1200w_v1.jpeg"
          alt="Go to the Tanddeus home page"
        />
        -->
        <img
          ref="titleRef"
          srcset="
            /images/components/the-header/large-screens/logo/png/logo_300w_v1.png  1x,
            /images/components/the-header/large-screens/logo/png/logo_450w_v1.png  1.5x,
            /images/components/the-header/large-screens/logo/png/logo_600w_v1.png  2x,
            /images/components/the-header/large-screens/logo/png/logo_900w_v1.png  3x,
            /images/components/the-header/large-screens/logo/png/logo_1200w_v1.png 4x,
            /images/components/the-header/large-screens/logo/png/logo_1200w_v1.png
          "
          src="/images/components/the-header/large-screens/logo/png/logo_300w_v1.png"
          alt="Go to the Tanddeus home page"
          width="300"
          height="32"
        />
      </picture>
    </NuxtLink>
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
      x: titleElementLeft,
      y: titleElementTop,
    };
  };

  backgroundRendererRef.value = new BackgroundRenderer(
    svgRef.value!,
    getOrigin,
  );

  backgroundRendererRef.value.drawBackground();
  backgroundRendererRef.value?.watchForChanges();
});

onUnmounted(() => {
  backgroundRendererRef.value?.stopWatchingForChanges();
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

.main-navigation__link:hover {
  color: $color-teal;
  text-shadow: 1px 1px 3px #6bdcff40;
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
