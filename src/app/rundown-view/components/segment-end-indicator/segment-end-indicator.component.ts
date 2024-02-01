import { Component, HostBinding, Input } from '@angular/core'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-segment-end-indicator',
  templateUrl: './segment-end-indicator.component.html',
  styleUrls: ['./segment-end-indicator.component.scss'],
})
export class SegmentEndIndicatorComponent {
  @Input()
  public lastPartInSegment?: Part

  @HostBinding('class.active')
  public get isLastPartOnAir(): boolean {
    return this.lastPartInSegment?.isOnAir ?? false
  }
  public readonly nextLabel: string = $localize`global.next.label`
  public readonly autoLabel: string = $localize`global.auto.label`
}
