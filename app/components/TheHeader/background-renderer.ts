import { gsap } from 'gsap';
import { calculateEndPoint, Angle, type Point } from '~/shared';

export class BackgroundRenderer {
  private static readonly startAngle = Angle.FromDegrees(360);
  private static readonly endAngle = Angle.FromDegrees(0);
  private static readonly angleIncrement = Angle.FromDegrees(5);
  private static readonly strokeColor = '#6bdcff';
  private static readonly strokeWidth = 1;

  private svgElement: SVGElement;
  private getOrigin: () => Point;
  private linesByDegrees: Map<number, SVGLineElement> = new Map();
  private resizeObserver?: ResizeObserver;

  constructor(
    svgElement: SVGElement,
    getOrigin: (svgWidth: number, svgHeight: number) => Point,
  ) {
    this.svgElement = svgElement;
    this.getOrigin = () => {
      return getOrigin(
        this.svgElement.clientWidth,
        this.svgElement.clientHeight,
      );
    };
  }

  drawBackground() {
    for (
      const angle = Angle.FromAngle(BackgroundRenderer.startAngle);
      angle.degrees > BackgroundRenderer.endAngle.degrees;
      angle.degrees -= BackgroundRenderer.angleIncrement.degrees
    ) {
      const lineElement = this.createLineElement(angle);
      this.svgElement.appendChild(lineElement);
      this.linesByDegrees.set(angle.degrees, lineElement);
    }
  }

  watchForResize() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateLines();
    });

    this.resizeObserver.observe(this.svgElement);
  }

  stopWatchingForResize() {
    this.resizeObserver?.disconnect();
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

    line.setAttribute('stroke', BackgroundRenderer.strokeColor);
    line.setAttribute(
      'stroke-width',
      BackgroundRenderer.strokeWidth.toString(),
    );
    line.style.opacity = '0.2';

    return line;
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
