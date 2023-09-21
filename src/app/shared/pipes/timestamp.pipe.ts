import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  public transform(timestampInSeconds: number): string {
    const seconds: number = timestampInSeconds % 60
    const minutes: number = Math.floor((timestampInSeconds % 3600) / 60)
    const hours: number = Math.floor( timestampInSeconds / 3600)

    return `${this.formatHours(hours)}${this.formatMinutes(minutes)}${this.formatSeconds(seconds)}`
  }

  private formatHours(hours: number): string {
    if (hours <= 0) {
      return ''
    }
    return hours.toString().padStart(2, '0') + ':'
  }

  private formatMinutes(minutes: number): string {
    return minutes.toString().padStart(2, '0') + ':'
  }

  private formatSeconds(seconds: number): string {
    return seconds.toString().padStart(2, '0')
  }
}
