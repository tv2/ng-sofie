import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'sofie-timeline-flag',
  templateUrl: './timeline-flag.component.html',
  styleUrls: ['./timeline-flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-timeline-flag'
  }
})
export class TimelineFlagComponent {
  @Input()
  public label?: string

  @Input()
  @HostBinding('class.c-timeline-flag--turned-on')
  public turnedOn: boolean

  @HostBinding('class.c-timeline-flag--no-label')
  public get hasNoLabel() { return !this.label }

  @Input()
  @HostBinding('class.c-timeline-flag--dimmed')
  public dimmed: boolean = false
}
