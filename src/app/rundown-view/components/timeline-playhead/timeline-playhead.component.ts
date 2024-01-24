import { Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'sofie-timeline-playhead',
  templateUrl: './timeline-playhead.component.html',
  styleUrls: ['./timeline-playhead.component.scss'],
})
export class TimelinePlayheadComponent {
  @Input()
  public time: number

  @Input()
  public pixelsPerSecond: number

  @Input()
  public timerDurationInMs?: number

  @HostBinding('style.left.px')
  public get left(): number {
    return Math.floor((this.time * this.pixelsPerSecond) / 1000)
  }
}
