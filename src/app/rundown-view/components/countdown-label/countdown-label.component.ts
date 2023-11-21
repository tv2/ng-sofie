import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core'

@Component({
  selector: 'sofie-countdown-label',
  templateUrl: './countdown-label.component.html',
  styleUrls: ['./countdown-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownLabelComponent {
  @Input()
  public durationInMs: number

  @Input()
  public currentEpochTime: number

  @HostListener('click', ['$event'])
  private toggleDisplayMode(): void {
    this.showTimestamp = !this.showTimestamp
  }
  public showTimestamp: boolean = false
}
