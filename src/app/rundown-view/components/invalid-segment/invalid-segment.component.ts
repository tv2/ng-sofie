import { Component, Input } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Icon, IconSize } from '../../../shared/enums/icon'

@Component({
  selector: 'sofie-invalid-segment',
  templateUrl: './invalid-segment.component.html',
  styleUrls: ['invalid-segment.component.scss'],
})
export class InvalidSegmentComponent {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  @Input()
  public segment: Segment
}
