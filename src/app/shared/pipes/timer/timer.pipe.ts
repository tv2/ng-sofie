import { Pipe, PipeTransform } from '@angular/core'

const POSITIVE_SIGN: string = '+'
const NEGATIVE_SIGN: string = '-'

@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {
  public transform(durationInMs: number, format: string): string {
    return [this.applySignFormat.bind(this), this.applyHoursFormat.bind(this), this.applyMinutesFormat.bind(this), this.applySecondsFormat.bind(this)].reduce(
      (partiallyFormattedResult, applyFormat) => applyFormat(partiallyFormattedResult, durationInMs),
      format
    )
  }

  private applySignFormat(format: string, durationInMs: number): string {
    if (!/[#+-]/.test(format)) {
      return format
    }

    if (/#\+/.test(format)) {
      const sign: string = durationInMs < 0 ? '' : POSITIVE_SIGN
      const updatedFormat: string = format.replace(/#\+/g, sign)
      return this.applySignFormat(updatedFormat, durationInMs)
    }

    if (/#-/.test(format)) {
      const sign: string = durationInMs < 0 ? NEGATIVE_SIGN : ''
      const updatedFormat: string = format.replace(/#-/g, sign)
      return this.applySignFormat(updatedFormat, durationInMs)
    }

    if (/#/.test(format)) {
      const sign: string = durationInMs < 0 ? NEGATIVE_SIGN : POSITIVE_SIGN
      const updatedFormat: string = format.replace(/#/g, sign)
      return this.applySignFormat(updatedFormat, durationInMs)
    }

    return format
  }

  private applyHoursFormat(format: string, durationInMs: number): string {
    if (!/H/.test(format)) {
      return format
    }

    const absoluteDurationInSeconds: number = Math.abs(Math.floor(durationInMs / 1000))

    if (/H\?/.test(format)) {
      const durationGoesBeyondMinutes: boolean = absoluteDurationInSeconds >= 3600
      if (!durationGoesBeyondMinutes) {
        const updatedFormat: string = format.replace(/H+\?[.: ]*/g, '')
        return this.applyHoursFormat(updatedFormat, durationInMs)
      }
      const updatedFormat: string = format.replace(/H\?/g, 'H')
      return this.applyHoursFormat(updatedFormat, durationInMs)
    }

    const hours: number = Math.floor(absoluteDurationInSeconds / 3600)
    if (/HH/.test(format)) {
      const updatedFormat: string = format.replace(/HH/g, hours.toString().padStart(2, '0'))
      return this.applyHoursFormat(updatedFormat, durationInMs)
    }

    if (/H/.test(format)) {
      const updatedFormat: string = format.replace(/H/g, hours.toString())
      return this.applyHoursFormat(updatedFormat, durationInMs)
    }

    return format
  }

  private applyMinutesFormat(format: string, durationInMs: number): string {
    if (!/m/.test(format)) {
      return format
    }

    const absoluteDurationInSeconds: number = Math.abs(Math.floor(durationInMs / 1000))
    const minutes: number = Math.floor((absoluteDurationInSeconds % 3600) / 60)

    if (/mm/.test(format)) {
      const updatedFormat: string = format.replace(/mm/g, minutes.toString().padStart(2, '0'))
      return this.applyMinutesFormat(updatedFormat, durationInMs)
    }

    if (/m/.test(format)) {
      const updatedFormat: string = format.replace(/m/g, minutes.toString())
      return this.applyMinutesFormat(updatedFormat, durationInMs)
    }

    return format
  }

  private applySecondsFormat(format: string, durationInMs: number): string {
    if (!/s/.test(format)) {
      return format
    }

    const seconds: number = Math.abs(Math.floor(durationInMs / 1000) % 60)

    if (/ss/.test(format)) {
      const updatedFormat: string = format.replace(/ss/g, seconds.toString().padStart(2, '0'))
      return this.applySecondsFormat(updatedFormat, durationInMs)
    }

    if (/s/.test(format)) {
      const updatedFormat: string = format.replace(/s/g, seconds.toString())
      return this.applySecondsFormat(updatedFormat, durationInMs)
    }

    return format
  }

  //public transform(durationInMs: number, format: string = 'HH:mm:ss'): string {
  //  const durationInSeconds: number = Math.floor(durationInMs / 1000)
  //  const absoluteDurationInSeconds: number = Math.abs(durationInSeconds)
  //  const seconds: number = absoluteDurationInSeconds % 60
  //  const minutes: number = Math.floor((absoluteDurationInSeconds % 3600) / 60)
  //  const hours: number = Math.floor(absoluteDurationInSeconds / 3600)
  //  const sign: string = this.getSign(durationInSeconds, format)
  //  return `${sign}${this.formatDigits(hours)}:${this.formatDigits(minutes)}:${this.formatDigits(seconds)}`
  //}

  //private getSign(durationInSeconds: number, signsToUse: string): string {
  //  const sign: string = durationInSeconds <= 0 ? NEGATIVE_SIGN : POSITIVE_SIGN
  //  return signsToUse.includes(sign) ? sign : ''
  //}

  //private formatDigits(digits: number): string {
  //  return digits.toString().padStart(2, '0')
  //}
}
