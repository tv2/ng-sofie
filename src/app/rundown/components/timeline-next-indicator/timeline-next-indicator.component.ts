import { Component, Input } from '@angular/core'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-timeline-next-indicator',
  templateUrl: './timeline-next-indicator.component.html',
  styleUrls: ['./timeline-next-indicator.component.scss']
})
export class TimelineNextIndicatorComponent {
  @Input()
  public part: Part
}
