import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatKeyboardKeys',
})
export class FormatKeyboardKeysPipe implements PipeTransform {
  public transform(keys: string[]): string {
    return keys.map(key => this.formatKey(key)).join(' + ')
  }

  private formatKey(key: string): string {
    if (/Key/g.test(key)) {
      return key.replace(/Key/g, '')
    } else if (/Digit/g.test(key)) {
      return `${key.replace(/Digit/g, '')} (Digit)`
    } else if (/Numpad/g.test(key)) {
      return `${key.replace(/Numpad/g, '')} (Numpad)`
    }
    return key
  }
}
