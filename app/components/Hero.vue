<template>
  <svg ref="svgRef"></svg>
</template>

<script setup lang="ts">
const { $gsap } = useNuxtApp();
const svgRef = ref<SVGElement | null>(null);

const lineSeparationDegrees = 5;
const numLines = 360 / lineSeparationDegrees;
const perLineDuration = 2; // 0.064;
const baseLineDelay = perLineDuration / 4;

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
    let color;
    const na = normalizeAngle(a);

    if (na < 90) {
      color = 'red';
      console.log(na % 90);
    } else if (na < 180) {
      color = 'green';
    } else if (na < 270) {
      color = 'yellow';
    } else {
      color = 'blue';
    }

    line.setAttribute('stroke', color); //'#6bdcff');
    line.setAttribute('stroke-width', '1');
    line.style.opacity = '0';

    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());

    // Initially, set x2 and y2 to the same values as the starting point
    line.setAttribute('x2', x1.toString());
    line.setAttribute('y2', y1.toString());

    svgRef.value!.appendChild(line);

    const [x2, y2] = calculateEndPoint(x1, y1, svgWidth, svgHeight, a);
    const duration = calculateDuration(
      [x1, y1],
      [x2!, y2!],
      svgWidth,
      svgHeight,
      perLineDuration,
    );

    if ((x2 && x2 < 0) || (y2 && y2 < 0)) {
      console.log({
        angle: a,
        normalizedAngle: normalizeAngle(a),
        start: [x1, y1],
        end: [x2, y2],
        duration,
        speed: Math.sqrt((x2! - x1) ** 2 + (y2! - y1) ** 2) / duration,
      });
    }

    // delay should be based on baseDuration / numLines or something
    const delay = baseLineDelay * j;

    $gsap.to(line, {
      attr: {
        x2: x2!,
        y2: y2!,
      },
      duration,
      delay,
      // modifiers: {
      //   x2: (value, target) => {
      //     console.log(value, target);
      //     return value;
      //   },
      // },
    });

    $gsap.to(line, {
      opacity: 1,
      duration: perLineDuration,
      delay,
    });

    // when the screen size changes during the animation, x1, y1, x2, y2,
    // duration all need to change
    // progress should be taken into account, though, so that the animation
    // doesn't just keep restarting when the screen size changes
    // if progress is 1, the value is immediately set
    // if progress is less than 1, the other values are dynamically
    // calculated based on progress and the new screen size

    // it would also be nice to be able to "ease" each line

    // one event listener that updates all tweens would be more efficient
    // than an event listener for each tween, probably (cost of event listeners?)
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
  let normalizedAngle = normalizeAngle(angleInDegrees);
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

  const radians = degToRad(normalizedAngle % 90);

  const hypFromAdjacent = adjacent / Math.cos(radians);
  const hypFromOpposite = opposite / Math.sin(radians);

  // adjacent and opposite should never be negative
  if (hypFromAdjacent < 0 || hypFromOpposite < 0) {
    console.log(
      `Hypotenuse was negative: angle: ${angleInDegrees}, normalizedAngle: ${normalizedAngle}, from adj: ${hypFromAdjacent}, from opp: ${hypFromOpposite}`,
    );
  }

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
