import { Pipe, PipeTransform } from '@angular/core'

const POSITIVE_SIGN: string = '+'
const NEGATIVE_SIGN: string = '-'

@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {
  public transform(durationInMs: number, signsToUse: string = '+-'): string {
    const durationInSeconds: number = Math.floor(durationInMs / 1000)
    const absoluteDurationInSeconds: number = Math.abs(durationInSeconds)
    const seconds: number = absoluteDurationInSeconds % 60
    const minutes: number = Math.floor((absoluteDurationInSeconds % 3600) / 60)
    const hours: number = Math.floor(absoluteDurationInSeconds / 3600)
    const sign: string = this.getSign(durationInSeconds, signsToUse)
    return `${sign}${this.formatDigits(hours)}:${this.formatDigits(minutes)}:${this.formatDigits(seconds)}`
  }

  private getSign(durationInSeconds: number, signsToUse: string): string {
    const sign: string = durationInSeconds <= 0 ? NEGATIVE_SIGN : POSITIVE_SIGN
    return signsToUse.includes(sign) ? sign : ''
  }

  private formatDigits(digits: number): string {
    return digits.toString().padStart(2, '0')
  }
}
