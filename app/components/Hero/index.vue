<template>
  <svg ref="svgRef"></svg>
</template>

<script setup lang="ts">
import { Temporal } from 'temporal-polyfill';
import { BackgroundAnimationManager } from './background-animation-manager';

const svgRef = ref<SVGElement | null>(null);

onMounted(() => {
  const backgroundAnimationManager = new BackgroundAnimationManager(
    svgRef.value!,
    (svgWidth: number, svgHeight: number) => {
      return {
        x: svgWidth / 2,
        y: svgHeight / 2,
      };
    },
    Temporal.Duration.from({ milliseconds: 1000 }),
  );

  backgroundAnimationManager.beginAnimation();
});
</script>

<style>
svg {
  width: 100%;
  height: 100%;
  background-color: #242424;
}
</style>
