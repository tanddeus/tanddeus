<template>
  <button
    class="hamburger"
    :class="{ 'hamburger--open': isOpen }"
    @click="toggleMenu"
  >
    <div class="hamburger__row">
      <span class="hamburger__bar hamburger__bar--top-left"></span>
      <span class="hamburger__bar hamburger__bar--top-right"></span>
    </div>

    <div class="hamburger__row">
      <span class="hamburger__bar hamburger__bar--middle"></span>
    </div>

    <div class="hamburger__row">
      <span class="hamburger__bar hamburger__bar--bottom-left"></span>
      <span class="hamburger__bar hamburger__bar--bottom-right"></span>
    </div>
  </button>
</template>

<script setup lang="ts">
const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/partials' as *;

.hamburger {
  width: 65px;
  height: 68px;
  border: none;
  box-sizing: border-box;
  padding: 18px 12.5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: transparent;
}

.hamburger__row {
  display: flex;
  justify-content: center;
  width: 40px;
  height: 3px;
  position: relative;
}

.hamburger__bar {
  display: inline-block;
  height: 3px;
  border-radius: 1.5px;
  transition: all 300ms ease-out;
  background-color: $color-teal;
}

.hamburger__bar--top-left {
  width: 22px;
  position: absolute;
  top: 0;
  left: 0;
}

.hamburger__bar--top-right {
  width: 22px;
  position: absolute;
  top: 0;
  right: 0;
}

.hamburger__bar--middle {
  width: 40px;
}

.hamburger__bar--bottom-left {
  width: 22px;
  position: absolute;
  top: 0;
  left: 0;
}

.hamburger__bar--bottom-right {
  width: 22px;
  position: absolute;
  top: 0;
  right: 0;
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
