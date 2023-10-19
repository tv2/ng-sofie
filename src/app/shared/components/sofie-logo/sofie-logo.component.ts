import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'sofie-logo',
  templateUrl: './sofie-logo.component.html',
  styleUrls: ['./sofie-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SofieLogoComponent {
  @Input()
  @HostBinding('class.with-text')
  public withText: boolean = false
}
