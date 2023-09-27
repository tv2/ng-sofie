import { Component, HostBinding, Input } from '@angular/core'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-segment-end-indicator',
  templateUrl: './segment-end-indicator.component.html',
  styleUrls: ['./segment-end-indicator.component.scss'],
  host: {
    class: 'c-segment-end-indicator',
  },
})
export class SegmentEndIndicatorComponent {
  @Input()
  public lastPartInSegment?: Part

  @HostBinding('class.c-segment-end-indicator--active')
  public get isLastPartOnAir(): boolean { return this.lastPartInSegment?.isOnAir ?? false }
}
