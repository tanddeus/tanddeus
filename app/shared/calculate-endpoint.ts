import { Angle } from './angle';
import type { Point } from './point';

/**
 * Given a starting point and an angle, calculates the endpoint of a line
 * drawn from that starting point such that the endpoint is at the edge of the
 * containing element.
 */
export function calculateEndPoint(
  origin: Point,
  containerWidth: number,
  containerHeight: number,
  angle: Angle,
) {
  let possibleOpposite: number, possibleAdjacent: number;

  if (angle.degrees <= 90) {
    possibleAdjacent = origin.y;
    possibleOpposite = containerWidth - origin.x;
  } else if (angle.degrees <= 180) {
    possibleAdjacent = origin.x;
    possibleOpposite = origin.y;
  } else if (angle.degrees <= 270) {
    possibleAdjacent = containerHeight - origin.y;
    possibleOpposite = origin.x;
  } else {
    possibleAdjacent = containerWidth - origin.x;
    possibleOpposite = containerHeight - origin.y;
  }

  const theta = makeAcute(angle);
  const hypotenuseFromAdjacent = calculateHypotenuseFromAdjacent(
    possibleAdjacent,
    theta,
  );
  const hypotenuseFromOpposite = calculateHypotenuseFromOpposite(
    possibleOpposite,
    theta,
  );

  if (hypotenuseFromAdjacent < hypotenuseFromOpposite) {
    const actualOpposite = Math.sqrt(
      hypotenuseFromAdjacent ** 2 - possibleAdjacent ** 2,
    );

    if (angle.degrees <= 90) {
      return { x: origin.x + actualOpposite, y: 0 };
    } else if (angle.degrees <= 180) {
      return { x: 0, y: origin.y - actualOpposite };
    } else if (angle.degrees <= 270) {
      return { x: origin.x - actualOpposite, y: containerHeight };
    }

    return { x: containerWidth, y: origin.y + actualOpposite };
  }

  const actualAdjacent = Math.sqrt(
    hypotenuseFromOpposite ** 2 - possibleOpposite ** 2,
  );

  if (angle.degrees <= 90) {
    return { x: containerWidth, y: origin.y - actualAdjacent };
  } else if (angle.degrees <= 180) {
    return { x: origin.x - actualAdjacent, y: 0 };
  } else if (angle.degrees <= 270) {
    return { x: 0, y: origin.y + actualAdjacent };
  }

  return { x: origin.x + actualAdjacent, y: containerHeight };
}

function makeAcute(angle: Angle) {
  return Angle.FromDegrees((360 - angle.degrees) % 90);
}

function calculateHypotenuseFromAdjacent(adjacent: number, theta: Angle) {
  return adjacent / Math.cos(theta.radians);
}

function calculateHypotenuseFromOpposite(opposite: number, theta: Angle) {
  return opposite / Math.sin(theta.radians);
}
