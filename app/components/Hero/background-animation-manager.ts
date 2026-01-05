import { gsap } from 'gsap';
import { Temporal } from 'temporal-polyfill';
import { Angle, type Point } from '~/shared';

export class BackgroundAnimationManager {
  private static readonly startAngle = Angle.FromDegrees(360);
  private static readonly endAngle = Angle.FromDegrees(0);
  private static readonly angleIncrement = Angle.FromDegrees(5);
  private static readonly lineAnimationDelayToDurationRatio = 1 / 4;
  private static readonly strokeColor = '#6bdcff';
  private static readonly strokeWidth = 1;

  private svgElement: SVGElement;
  private getOrigin: () => Point;
  private lineAnimationDuration: Temporal.Duration;
  private baseLineAnimationDelay: Temporal.Duration;
  private lineAnimationEasingFunction: GSAPTweenVars['ease'];
  private fadeAnimationDuration: Temporal.Duration;
  private fadeAnimationEasingFunction: GSAPTweenVars['ease'];
  private initialDelay?: Temporal.Duration;
  private linesByDegrees: Map<number, SVGLineElement> = new Map();

  constructor(
    svgElement: SVGElement,
    getOrigin: (svgWidth: number, svgHeight: number) => Point,
    totalLinesAnimationDuration: Temporal.Duration,
    lineAnimationEasingFunction: GSAPTweenVars['ease'],
    fadeAnimationDuration: Temporal.Duration,
    fadeAnimationEasingFunction: GSAPTweenVars['ease'],
    initialDelay?: Temporal.Duration,
  ) {
    this.svgElement = svgElement;
    this.getOrigin = () =>
      getOrigin(this.svgElement.clientWidth, this.svgElement.clientHeight);

    this.lineAnimationDuration = this.calculateLineAnimationDuration(
      totalLinesAnimationDuration,
    );

    this.baseLineAnimationDelay = this.calculateBaseLineAnimationDelay();
    this.lineAnimationEasingFunction = lineAnimationEasingFunction;
    this.fadeAnimationDuration = fadeAnimationDuration;
    this.fadeAnimationEasingFunction = fadeAnimationEasingFunction;
    this.initialDelay = initialDelay;
  }

  beginAnimation() {
    this.createAndAnimateLines();
    this.handleSVGResizeEvents();
  }

  private calculateLineAnimationDuration(
    totalAnimationDuration: Temporal.Duration,
  ): Temporal.Duration {
    const totalLines =
      BackgroundAnimationManager.startAngle.degrees /
      BackgroundAnimationManager.angleIncrement.degrees;

    const milliseconds = Math.round(
      totalAnimationDuration.total('milliseconds') /
        ((totalLines - 1) *
          BackgroundAnimationManager.lineAnimationDelayToDurationRatio +
          1),
    );

    return Temporal.Duration.from({ milliseconds });
  }

  private calculateBaseLineAnimationDelay() {
    const milliseconds = Math.round(
      this.lineAnimationDuration.total('milliseconds') *
        BackgroundAnimationManager.lineAnimationDelayToDurationRatio,
    );

    return Temporal.Duration.from({ milliseconds });
  }

  private createAndAnimateLines() {
    const timeline = gsap.timeline({
      paused: true,
    });

    for (
      const angle = Angle.FromAngle(BackgroundAnimationManager.startAngle);
      angle.degrees > BackgroundAnimationManager.endAngle.degrees;
      angle.degrees -= BackgroundAnimationManager.angleIncrement.degrees
    ) {
      const lineElement = this.createLineElement(angle);
      this.svgElement.appendChild(lineElement);

      const delay = this.calculateAdjustedDelay(angle);

      timeline.add(
        gsap.to(lineElement, {
          opacity: 1,
          duration: this.lineAnimationDuration.total('seconds'),
        }),
        delay,
      );

      this.linesByDegrees.set(angle.degrees, lineElement);
    }

    gsap
      .to(timeline, {
        duration: timeline.totalDuration(),
        progress: 1,
        ease: this.lineAnimationEasingFunction,
        delay: this.initialDelay?.total('seconds'),
      })
      .then(() => {
        for (const line of this.linesByDegrees.values()) {
          gsap.to(line, {
            opacity: 0.2,
            duration: this.fadeAnimationDuration.total('seconds'),
            ease: this.fadeAnimationEasingFunction,
          });
        }
      });
  }

  private createLineElement(angle: Angle) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    const origin = this.getOrigin();
    const endPoint = this.calculateEndPoint(angle);
    line.setAttribute('x1', origin.x.toString());
    line.setAttribute('y1', origin.y.toString());
    line.setAttribute('x2', endPoint.x.toString());
    line.setAttribute('y2', endPoint.y.toString());

    line.setAttribute('stroke', BackgroundAnimationManager.strokeColor);
    line.setAttribute(
      'stroke-width',
      BackgroundAnimationManager.strokeWidth.toString(),
    );
    line.style.opacity = '0';
    return line;
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

  private calculateAdjustedDelay(angle: Angle) {
    return (
      this.baseLineAnimationDelay.total('seconds') *
      ((BackgroundAnimationManager.startAngle.degrees - angle.degrees) /
        BackgroundAnimationManager.angleIncrement.degrees)
    );
  }

  private handleSVGResizeEvents() {
    const observer = new ResizeObserver(() => {
      this.updateLinesAndTweens();
    });

    observer.observe(this.svgElement);
  }

  private updateLinesAndTweens() {
    const origin = this.getOrigin();

    for (const [degrees, lineElement] of this.linesByDegrees.entries()) {
      const endPoint = this.calculateEndPoint(Angle.FromDegrees(degrees));
      gsap.set(lineElement, {
        attr: {
          x1: origin.x,
          y1: origin.y,
          x2: endPoint.x,
          y2: endPoint.y,
        },
      });
    }
  }
}
