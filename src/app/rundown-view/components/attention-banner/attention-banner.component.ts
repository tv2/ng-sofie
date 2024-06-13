import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Icon, IconSize } from '../../../shared/enums/icon'

@Component({
  selector: 'sofie-attention-banner',
  templateUrl: './attention-banner.component.html',
  styleUrls: ['./attention-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionBannerComponent {
  @Input()
  public label: string
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize
}
