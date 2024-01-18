import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'shortcutKeysToString',
})
export class ShortcutKeysToStringPipe implements PipeTransform {
  public transform(values: string[]): string {
    const newValue = []
    for (let value of values) {
      if (/\Key/g.test(value)) {
        newValue.push(value.replace(/\Key/g, ''))
      } else if (/\Digit/g.test(value)) {
        newValue.push(`${value.replace(/\Digit/g, '')} (Digit)`)
      } else if (/\Numpad/g.test(value)) {
        newValue.push(`${value.replace(/\Numpad/g, '')} (Numpad)`)
      } else {
        newValue.push(value)
      }
    }
    return newValue.length > 0 ? newValue.join(' + ') : ''
  }
}
