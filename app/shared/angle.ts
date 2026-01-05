export class Angle {
  static FromAngle(angle: Angle) {
    return new Angle(angle.degrees);
  }

  static FromDegrees(degrees: number) {
    return new Angle(degrees);
  }

  static FromRadians(radians: number) {
    return new Angle(this.RadiansToDegrees(radians));
  }

  static DegreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  static RadiansToDegrees(radians: number) {
    return (radians * 180) / Math.PI;
  }

  private constructor(public degrees: number) {}

  public get radians() {
    return Angle.DegreesToRadians(this.degrees);
  }

  public set radians(radians: number) {
    this.degrees = Angle.RadiansToDegrees(radians);
  }
}
