<template>
  <header class="header">
    <svg ref="svgRef" class="header__background"></svg>

    <nav class="header--navigation">
      <NuxtLink to="/">
        <img
          ref="titleRef"
          src="/images/components/hero/title.svg"
          alt="Go to the Tanddeus home page"
          class="header__title"
      /></NuxtLink>
      <HamburgerButton :is-open="showMenu" :set-is-open="setShowMenu" />
    </nav>

    <div v-if="showMenu" class="hamburger-menu">
      <ul class="hamburger-menu__items main-menu">
        <li class="main-menu__item">
          <NuxtLink to="/about" @click="setShowMenu(false)">About</NuxtLink>
        </li>
        <li class="main-menu__item">
          <NuxtLink to="/projects" @click="setShowMenu(false)"
            >Projects</NuxtLink
          >
        </li>
      </ul>
      <ul class="hamburger-menu__items social-media-menu">
        <a
          :href="INSTAGRAM_URL"
          target="_blank"
          rel="noreferrer"
          class="social-media-menu__link"
        >
          <img
            src="/images/shared/icons/instagram.svg"
            alt="Open the Tanddeus Instagram page in a new tab"
            class="social-media-menu__icon"
        /></a>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import HamburgerButton from './HamburgerButton.vue';
import { BackgroundRenderer } from './background-renderer';
import { INSTAGRAM_URL } from '~/shared';

const { $gsap } = useNuxtApp();

const svgRef = ref<SVGElement | null>(null);
const titleRef = ref<HTMLImageElement | null>(null);
const backgroundRendererRef = ref<BackgroundRenderer | null>(null);

const showMenu = ref(false);

const setShowMenu = (show: boolean) => {
  showMenu.value = show;
};

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
  backgroundRendererRef.value?.watchForResize();
});

onUnmounted(() => {
  backgroundRendererRef.value?.stopWatchingForResize();
});

watch(showMenu, () => {
  const currentHeaderAnimations = $gsap.getTweensOf('header');
  currentHeaderAnimations.forEach(animation => animation.pause());
  $gsap.to('header', {
    height: showMenu.value ? '100vh' : '68px',
    duration: 0.3,
    ease: 'ease-out',
  });
  currentHeaderAnimations.forEach(animation => animation.kill());
});

const scrollbarStatus = useScrollbarStatus();
const paddingLeft = computed(() => {
  return `${scrollbarStatus.scrollbarWidth + 12.5}px`;
});

const paddingRight = computed(() => {
  return scrollbarStatus.isPageScrollable ? 0 : (
      scrollbarStatus.scrollbarWidth + 'px'
    );
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/partials' as *;
@use './styles' as *;

.header {
  background-color: $color-dark-gray;
  border-bottom: 1px solid $color-teal;
  display: flex;
  flex-direction: column;
  height: $header-height;
  left: 0;
  overflow: hidden;
  padding-left: v-bind(paddingLeft);
  padding-right: v-bind(paddingRight);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}

.header--closed {
  animation: close-menu $menu-animation-duration $menu-animation-ease forwards;
}

.header--open {
  animation: open-menu $menu-animation-duration $menu-animation-ease forwards;
}

.header__background {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
}

.header--navigation {
  align-items: center;
  display: flex;
  height: $header-height;
  justify-content: space-between;

  // padding-left: $horizontal-padding-sm-screens;
}

.header__title {
  height: 22px;
}

.hamburger-menu {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.hamburger-menu__items {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.main-menu {
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 100px;
  justify-content: center;
}

.social-media-menu {
  display: flex;
  justify-content: center;
  padding: 35px 0;
}

.social-media-menu__link {
  display: block;
  padding: 2.5px;
}

.social-media-menu__icon {
  height: 30px;
  width: 30px;
}

@media screen and (height <= 430px) {
  .main-menu {
    flex-direction: row;
  }
}

/* stylelint-disable */
@keyframes open-menu {
  to {
    height: 100vh;
  }
}

@keyframes close-menu {
  to {
    height: $header-height;
  }
}
/* stylelint-enable */
</style>
