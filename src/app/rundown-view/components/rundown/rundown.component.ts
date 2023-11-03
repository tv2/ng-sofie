import { Component, Input } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent {
  @Input()
  public rundown?: Rundown

  public trackSegment(_: number, segment: Segment): string {
    return segment.id
  }
}
