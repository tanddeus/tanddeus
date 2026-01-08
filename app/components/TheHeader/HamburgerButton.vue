<template>
  <button
    class="hamburger"
    :class="{ 'hamburger--open': isOpen }"
    @click="toggleMenu"
  >
    <div class="hamburger__row">
      <span class="hamburger__bar hamburger__bar--top-left" />
      <span class="hamburger__bar hamburger__bar--top-right" />
    </div>

    <div class="hamburger__row">
      <span class="hamburger__bar hamburger__bar--middle" />
    </div>

    <div class="hamburger__row">
      <span class="hamburger__bar hamburger__bar--bottom-left" />
      <span class="hamburger__bar hamburger__bar--bottom-right" />
    </div>
  </button>
</template>

<script setup lang="ts">
interface HamburgerButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const { isOpen, setIsOpen } = defineProps<HamburgerButtonProps>();

function toggleMenu() {
  setIsOpen(!isOpen);
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/partials' as *;
@use './styles' as *;

.hamburger {
  background-color: transparent;
  border: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: $header-height;
  justify-content: space-between;
  padding: 18px $horizontal-padding-sm-screens;
  width: 65px;
}

.hamburger__row {
  display: flex;
  height: 3px;
  justify-content: center;
  position: relative;
  width: 40px;
}

.hamburger__bar {
  background-color: $color-teal;
  border-radius: 1.5px;
  display: inline-block;
  height: 3px;
  transition: all $menu-animation-duration $menu-animation-ease;
}

.hamburger__bar--top-left {
  left: 0;
  position: absolute;
  top: 0;
  width: 22px;
}

.hamburger__bar--top-right {
  position: absolute;
  right: 0;
  top: 0;
  width: 22px;
}

.hamburger__bar--middle {
  width: 40px;
}

.hamburger__bar--bottom-left {
  left: 0;
  position: absolute;
  top: 0;
  width: 22px;
}

.hamburger__bar--bottom-right {
  position: absolute;
  right: 0;
  top: 0;
  width: 22px;
}

.hamburger--open .hamburger__bar--top-left {
  transform: rotate(135deg) translateY(-17px) translateX(-8px);
}

.hamburger--open .hamburger__bar--top-right {
  transform: rotate(-135deg) translateY(-15px) translateX(-14px);
}

.hamburger--open .hamburger__bar--middle {
  width: 0;
}

.hamburger--open .hamburger__bar--bottom-left {
  transform: rotate(-135deg) translateY(18px) translateX(14px);
}

.hamburger--open .hamburger__bar--bottom-right {
  transform: rotate(135deg) translateY(16px) translateX(5px);
}
</style>
