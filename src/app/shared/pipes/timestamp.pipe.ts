import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MillisecondsAsTime'
})
export class MillisecondsAsTimePipe implements PipeTransform {
  public transform(timeInMilliseconds: number): string {
    const timeInSeconds: number = timeInMilliseconds / 1000
    const seconds: number = timeInSeconds % 60
    const minutes: number = Math.floor((timeInSeconds % 3600) / 60)
    const hours: number = Math.floor( timeInSeconds / 3600)

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
