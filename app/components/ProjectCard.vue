<template>
  <a :href="url" target="_blank" rel="noreferrer">
    <figure class="project-card">
      <div class="project-card__slot">
        <slot />
      </div>
      <figcaption class="project__title">{{ title }}</figcaption>
    </figure>
  </a>
</template>

<script setup lang="ts">
interface ProjectCardProps {
  title: string;
  url: string;
}

defineProps<ProjectCardProps>();
</script>

<style lang="scss">
@use '~/assets/scss/partials' as *;

.project-card {
  margin: auto;
  max-width: 400px;
  width: 100%;
}

.project-card__slot {
  margin-bottom: 10px;
  width: 100%;
}

/* stylelint-disable */
.project-card__slot img {
  display: block;
  width: 100%;
  aspect-ratio: 8 / 5;
}
/* stylelint-enable */

.project__title {
  color: $color-white;
  font-family: $font-family-ubuntu-condensed;
  font-size: 22px;
  font-weight: 400;
}

.project-card:hover .project-card__slot {
  box-shadow: -1px -1px 8px 0 #6bdcff80;
}

.project-card:hover .project__title {
  color: $color-teal;
}
</style>
