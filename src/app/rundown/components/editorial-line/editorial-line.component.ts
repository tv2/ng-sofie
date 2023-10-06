import { Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'sofie-editorial-line',
  template: '',
  styleUrls: ['./editorial-line.component.scss'],
})
export class EditorialLineComponent {
  @Input()
  public budgetDurationInMs: number

  @Input()
  public pixelsPerSecond: number

  @Input()
  public offsetInMs: number

  @HostBinding('style.left.px')
  public get left(): number {
    return Math.ceil(((this.budgetDurationInMs - this.offsetInMs) * this.pixelsPerSecond) / 1000)
  }
}
