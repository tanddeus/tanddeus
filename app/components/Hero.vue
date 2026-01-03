<template>
  <svg ref="svgRef"></svg>
</template>

<script setup lang="ts">
const { $gsap } = useNuxtApp();
const svgRef = ref<SVGElement | null>(null);

/*
  Note that both the adjusted duration of each animation as well as the endpoint 
  will have to change when the screen size changes.
*/
onMounted(() => {
  const svgWidth = svgRef.value!.clientWidth;
  const svgHeight = svgRef.value!.clientHeight;

  // These will be set more dynamically, depending on
  // media queries / the position of the heading
  const x1 = svgWidth / 2;
  const y1 = svgHeight / 2;

  for (let a = 90, j = 0; a > -270; a -= 5, j++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', '#6bdcff');
    line.setAttribute('stroke-width', '1');
    line.style.opacity = '0';

    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());

    // Initially, set x2 and y2 to the same values as the starting point
    line.setAttribute('x2', x1.toString());
    line.setAttribute('y2', y1.toString());
    svgRef.value!.appendChild(line);

    const [x2, y2] = calculateEndPoint(x1, y1, svgWidth, svgHeight, a);
    const baseDuration = 0.2;
    const duration = calculateDuration(
      [x1, y1],
      [x2!, y2!],
      svgWidth,
      svgHeight,
      baseDuration,
    );

    const delay = 0.0125 * j;

    $gsap.to(line, {
      attr: {
        x2: x2!,
        y2: y2!,
      },
      duration,
      delay,
    });

    $gsap.to(line, {
      opacity: 1,
      duration: baseDuration,
      delay,
    });
  }
});

/**
 * Calculates the end point of a line segment given its starting point, the
 * width and height of the containing element, and the angle at which to draw
 * the line from the starting point. The end point is calculated so that it is
 * positioned exactly at the border of the containing element.
 */
function calculateEndPoint(
  x1: number,
  y1: number,
  containerWidth: number,
  containerHeight: number,
  angleInDegrees: number,
) {
  const normalizedAngle = normalizeAngle(angleInDegrees);
  const radians = degToRad(normalizedAngle);
  let adjacent, opposite;

  if (normalizedAngle < 90) {
    adjacent = containerHeight - y1;
    opposite = containerWidth - x1;
  } else if (normalizedAngle < 180) {
    adjacent = y1;
    opposite = containerWidth - x1;
  } else if (normalizedAngle < 270) {
    adjacent = y1;
    opposite = x1;
  } else {
    adjacent = containerHeight - y1;
    opposite = x1;
  }

  const hypFromAdjacent = adjacent / Math.cos(radians);
  const hypFromOpposite = opposite / Math.sin(radians);

  if (hypFromAdjacent < hypFromOpposite) {
    opposite = Math.sqrt(hypFromAdjacent ** 2 - adjacent ** 2);
  } else {
    adjacent = Math.sqrt(hypFromOpposite ** 2 - opposite ** 2);
  }

  if (normalizedAngle >= 90 && normalizedAngle < 270) {
    adjacent *= -1;
  }

  if (normalizedAngle >= 180) {
    opposite *= -1;
  }

  const x2 = x1 + opposite;
  const y2 = y1 + adjacent;

  return [x2, y2];
}

/** Formats an angle in degrees such that it is >= 0 and < 360. */
function normalizeAngle(angleInDegrees: number) {
  angleInDegrees = angleInDegrees % 360;
  if (angleInDegrees < 0) angleInDegrees = angleInDegrees + 360;
  return angleInDegrees;
}

/** Converts a value in degrees to its equivalent in radians. */
function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function calculateDuration(
  p1: [number, number],
  p2: [number, number],
  containerWidth: number,
  containerHeight: number,
  baseDuration: number,
) {
  const maxLineLength = Math.max(
    p1[0],
    containerWidth - p1[0],
    p2[1],
    containerHeight - p2[0],
  );

  const actualLineLength = Math.sqrt(
    (p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2,
  );

  return baseDuration * (actualLineLength / maxLineLength);
}
</script>

<style lang="css">
svg {
  width: 100%;
  height: 100%;
  background-color: #242424;
}
</style>
