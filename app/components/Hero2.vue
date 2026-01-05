<template>
  <svg ref="svgRef"></svg>
</template>

<script setup lang="ts">
interface Point {
  x: number;
  y: number;
}

const { $gsap } = useNuxtApp();
const svgRef = ref<SVGElement | null>(null);

const startingPointInDegrees = 360;
const endingPointInDegrees = 0;
const lineSeparationInDegrees = 5;
const perLineAnimationDuration = 2;
const perLineAnimationDelay = perLineAnimationDuration / 4;

onMounted(() => {
  const svgWidth = svgRef.value!.clientWidth;
  const svgHeight = svgRef.value!.clientHeight;
  // refactor this to be a point called origin
  const origin = {
    x: svgWidth / 2,
    y: svgHeight / 2,
  };

  const lineEndPoints: Point[] = [];
  let maxLineLength = 0;

  for (
    let degrees = startingPointInDegrees;
    degrees > endingPointInDegrees;
    degrees -= lineSeparationInDegrees
  ) {
    const endpoint = calculateEndPoint(origin, svgWidth, svgHeight, degrees);

    const length = calculateLength(origin, endpoint);
    if (length > maxLineLength) maxLineLength = length;

    lineEndPoints.push(endpoint);
  }

  for (let i = 0; i < lineEndPoints.length; i++) {
    const endPoint = lineEndPoints[i]!;
    const line = createLine(origin);
    svgRef.value!.appendChild(line);

    const tween = createTween(
      line,
      origin,
      endPoint,
      perLineAnimationDuration,
      maxLineLength,
      perLineAnimationDelay * i,
    );
  }
});

function calculateEndPoint(
  from: Point,
  containerWidth: number,
  containerHeight: number,
  angleInDegrees: number,
): Point {
  let possibleOpposite: number, possibleAdjacent: number;

  if (angleInDegrees <= 90) {
    possibleAdjacent = from.y;
    possibleOpposite = containerWidth - from.x;
  } else if (angleInDegrees <= 180) {
    possibleAdjacent = from.x;
    possibleOpposite = from.y;
  } else if (angleInDegrees <= 270) {
    possibleAdjacent = containerHeight - from.y;
    possibleOpposite = from.x;
  } else {
    possibleAdjacent = containerWidth - from.x;
    possibleOpposite = containerHeight - from.y;
  }

  const theta = degToRad(makeAcute(angleInDegrees));
  const hypFromAdjacent = findHypotenuseFromAdj(possibleAdjacent, theta);
  const hypFromOpposite = findHypotenuseFromOpp(possibleOpposite, theta);

  if (hypFromAdjacent < hypFromOpposite) {
    const actualOpposite = Math.sqrt(
      hypFromAdjacent ** 2 - possibleAdjacent ** 2,
    );

    if (angleInDegrees <= 90) {
      return { x: from.x + actualOpposite, y: 0 };
    } else if (angleInDegrees <= 180) {
      return { x: 0, y: from.y - actualOpposite };
    } else if (angleInDegrees <= 270) {
      return { x: from.x - actualOpposite, y: containerHeight };
    }

    return { x: containerWidth, y: from.y + actualOpposite };
  }

  const actualAdjacent = Math.sqrt(
    hypFromOpposite ** 2 - possibleOpposite ** 2,
  );

  if (angleInDegrees <= 90) {
    return { x: containerWidth, y: from.y - actualAdjacent };
  } else if (angleInDegrees <= 180) {
    return { x: from.x - actualAdjacent, y: 0 };
  } else if (angleInDegrees <= 270) {
    return { x: 0, y: from.y + actualAdjacent };
  }

  return { x: from.x + actualAdjacent, y: containerHeight };
}

function findHypotenuseFromAdj(adjacent: number, thetaInRadians: number) {
  return adjacent / Math.cos(thetaInRadians);
}

function findHypotenuseFromOpp(opposite: number, thetaInRadians: number) {
  return opposite / Math.sin(thetaInRadians);
}

function makeAcute(angleInDegrees: number) {
  return (360 - angleInDegrees) % 90;
}

function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function calculateLength(start: Point, end: Point) {
  return Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
}

function createTween(
  line: SVGLineElement,
  origin: Point,
  endpoint: Point,
  baseDuration: number,
  maxLineLength: number,
  delay: number,
) {
  const lineLength = calculateLength(origin, endpoint);
  const duration = (baseDuration * lineLength) / maxLineLength;
  return $gsap.to(line, {
    attr: {
      x2: endpoint.x,
      y2: endpoint.y,
    },
    duration,
    delay,
  });
}

function createLine(origin: Point) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('stroke', '#6bdcff');
  line.setAttribute('stroke-width', '1');
  // line.style.opacity = '0';

  line.setAttribute('x1', origin.x.toString());
  line.setAttribute('y1', origin.y.toString());
  line.setAttribute('x2', origin.x.toString());
  line.setAttribute('y2', origin.y.toString());
  return line;
}
</script>
