import { gsap } from 'gsap';
import { Temporal } from 'temporal-polyfill';
import { Angle, calculateEndPoint, type Point } from '~/shared';

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

  private lastOrigin?: Point;
  private lastSVGWidth?: number;
  private lastSVGHeight?: number;
  private interval?: ReturnType<typeof setInterval>;

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
    this.storeOriginAndSVGSize();
  }

  watchForChanges() {
    this.interval = setInterval(() => {
      const origin = this.getOrigin();
      if (
        origin.x !== this.lastOrigin?.x ||
        origin.y !== this.lastOrigin?.y ||
        this.svgElement.clientWidth !== this.lastSVGWidth ||
        this.svgElement.clientHeight !== this.lastSVGHeight
      ) {
        this.updateLines();
        this.storeOriginAndSVGSize();
      }
    }, 10);
  }

  stopWatchingForChanges() {
    clearInterval(this.interval);
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
    const endPoint = calculateEndPoint(
      origin,
      this.svgElement.clientWidth,
      this.svgElement.clientHeight,
      angle,
    );

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

  private calculateAdjustedDelay(angle: Angle) {
    return (
      this.baseLineAnimationDelay.total('seconds') *
      ((BackgroundAnimationManager.startAngle.degrees - angle.degrees) /
        BackgroundAnimationManager.angleIncrement.degrees)
    );
  }

  private storeOriginAndSVGSize() {
    this.lastOrigin = this.getOrigin();
    this.lastSVGWidth = this.svgElement.clientWidth;
    this.lastSVGHeight = this.svgElement.clientHeight;
  }

  private updateLines() {
    const origin = this.getOrigin();
    const clientWidth = this.svgElement.clientWidth;
    const clientHeight = this.svgElement.clientHeight;

    for (const [degrees, lineElement] of this.linesByDegrees.entries()) {
      const endPoint = calculateEndPoint(
        origin,
        clientWidth,
        clientHeight,
        Angle.FromDegrees(degrees),
      );

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
