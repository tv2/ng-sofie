import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minimum'
})
export class MinimumPipe implements PipeTransform {
  public transform(value: number, ...values: number[]): number {
    const lowestAmongValues: number = values.sort()[0] ?? Number.MIN_VALUE
    return Math.min(value, lowestAmongValues)
  }
}
