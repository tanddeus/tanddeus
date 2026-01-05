import { Temporal } from 'temporal-polyfill';
import { Angle, type Point } from '~/shared';
import { gsap } from 'gsap';

export class BackgroundAnimationManager {
  private static readonly startAngle = Angle.FromDegrees(360);
  private static readonly endAngle = Angle.FromDegrees(0);
  private static readonly angleIncrement = Angle.FromDegrees(5);
  private static readonly lineAnimationDelayToDurationRatio = 1 / 4;
  private static readonly strokeColor = '#6bdcff';
  private static readonly strokeWidth = 1;

  private svgElement: SVGElement;
  private getOrigin: () => Point;
  private baseLineAnimationDuration: Temporal.Duration;
  private baseLineAnimationDelay: Temporal.Duration;

  private linesAndTweensByDegrees: Map<
    number,
    { line: SVGLineElement; tween: ReturnType<typeof gsap.to> }
  > = new Map();

  constructor(
    svgElement: SVGElement,
    getOrigin: (svgWidth: number, svgHeight: number) => Point,
    totalAnimationDuration: Temporal.Duration,
  ) {
    this.svgElement = svgElement;
    this.getOrigin = () =>
      getOrigin(this.svgElement.clientWidth, this.svgElement.clientHeight);

    this.baseLineAnimationDuration = this.calculateBaseLineAnimationDuration(
      totalAnimationDuration,
    );

    this.baseLineAnimationDelay = this.calculateBaseLineAnimationDelay();
  }

  initializeAnimation() {
    const lineEndPoints = this.createLineEndPoints();
    this.createLineElementsAndTweens(lineEndPoints);
  }

  private calculateBaseLineAnimationDuration(
    totalAnimationDuration: Temporal.Duration,
  ): Temporal.Duration {
    // the end of the last animation should occur at the end of the total
    // duration
    // for now, simply return the total duration
    return totalAnimationDuration;
  }

  private calculateBaseLineAnimationDelay() {
    const milliseconds = Math.round(
      this.baseLineAnimationDuration.total('milliseconds') *
        BackgroundAnimationManager.lineAnimationDelayToDurationRatio,
    );

    return Temporal.Duration.from({ milliseconds });
  }

  private createLineEndPoints() {
    const lineEndPoints: Point[] = [];

    for (
      const angle = Angle.FromAngle(BackgroundAnimationManager.startAngle);
      angle.degrees > BackgroundAnimationManager.endAngle.degrees;
      angle.degrees -= BackgroundAnimationManager.angleIncrement.degrees
    ) {
      const endpoint = this.calculateEndPoint(angle);
      lineEndPoints.push(endpoint);
    }

    return lineEndPoints;
  }

  private calculateEndPoint(angle: Angle) {
    const containerWidth = this.svgElement.clientWidth;
    const containerHeight = this.svgElement.clientHeight;
    const origin = this.getOrigin();

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

    const theta = this.makeAcute(angle);
    const hypotenuseFromAdjacent = this.calculateHypotenuseFromAdjacent(
      possibleAdjacent,
      theta,
    );
    const hypotenuseFromOpposite = this.calculateHypotenuseFromOpposite(
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

  private makeAcute(angle: Angle) {
    return Angle.FromDegrees((360 - angle.degrees) % 90);
  }

  private calculateHypotenuseFromAdjacent(adjacent: number, theta: Angle) {
    return adjacent / Math.cos(theta.radians);
  }

  private calculateHypotenuseFromOpposite(opposite: number, theta: Angle) {
    return opposite / Math.sin(theta.radians);
  }

  private calculateLineLength(origin: Point, endpoint: Point) {
    return Math.sqrt(
      (endpoint.x - origin.x) ** 2 + (endpoint.y - origin.y) ** 2,
    );
  }

  private createLineElementsAndTweens(lineEndPoints: Point[]) {
    const maxLineLength = this.calculateMaxLineLength(lineEndPoints);

    for (let i = 0; i < lineEndPoints.length; i++) {
      const line = this.createLine();
      this.svgElement.appendChild(line);

      const endPoint = lineEndPoints[i]!;
      const delay = this.baseLineAnimationDelay.total('seconds') * i;
      const tween = this.createTween(line, endPoint, maxLineLength, delay);

      const degrees =
        BackgroundAnimationManager.startAngle.degrees -
        BackgroundAnimationManager.angleIncrement.degrees * i;
      this.linesAndTweensByDegrees.set(degrees, { line, tween });
    }
  }

  private calculateMaxLineLength(lineEndpoints: Point[]) {
    const origin = this.getOrigin();

    return lineEndpoints.reduce((max, endPoint) => {
      return Math.max(max, this.calculateLineLength(origin, endPoint));
    }, 0);
  }

  private createLine() {
    const origin = this.getOrigin();
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', BackgroundAnimationManager.strokeColor);
    line.setAttribute(
      'stroke-width',
      BackgroundAnimationManager.strokeWidth.toString(),
    );
    // line.style.opacity = '0';

    line.setAttribute('x1', origin.x.toString());
    line.setAttribute('y1', origin.y.toString());
    line.setAttribute('x2', origin.x.toString());
    line.setAttribute('y2', origin.y.toString());
    return line;
  }

  private createTween(
    line: SVGLineElement,
    endPoint: Point,
    maxLineLength: number,
    delay: number,
  ) {
    const lineLength = this.calculateLineLength(this.getOrigin(), endPoint);
    const duration =
      (this.baseLineAnimationDuration.total('seconds') * lineLength) /
      maxLineLength;
    return gsap.to(line, {
      attr: {
        x2: endPoint.x,
        y2: endPoint.y,
      },
      duration,
      delay,
    });
  }
}
