import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'sofie-timeline-flag',
  templateUrl: './timeline-flag.component.html',
  styleUrls: ['./timeline-flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineFlagComponent {
  @Input()
  public label?: string

  @Input()
  @HostBinding('class.turned-on')
  public turnedOn: boolean

  @HostBinding('class.no-label')
  public get hasNoLabel(): boolean {
    return !this.label
  }

  @Input()
  @HostBinding('class.dimmed')
  public dimmed: boolean = false
}
