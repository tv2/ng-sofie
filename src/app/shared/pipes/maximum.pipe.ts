import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maximum'
})
export class MaximumPipe implements PipeTransform {
  public transform(value: number, ...values: number[]): number {
    const lowestAmongValues: number = values.sort().slice(-1)[0] ?? Number.MIN_VALUE
    return Math.max(value, lowestAmongValues)
  }
}
