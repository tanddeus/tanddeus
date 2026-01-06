<template>
  <div class="header--sm-screens">
    <TheHeaderSmallScreens />
  </div>
  <div class="header--lg-screens">
    <TheHeaderLargeScreens />
  </div>
</template>

<style lang="scss" scoped>
.header--lg-screens {
  display: none;
}

@media screen and (min-width: 1000px) {
  .header--sm-screens {
    display: none;
  }

  .header--lg-screens {
    display: initial;
  }
}
</style>
