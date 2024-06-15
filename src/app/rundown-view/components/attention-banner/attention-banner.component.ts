import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'
import { Icon, IconSize } from '../../../shared/enums/icon'

@Component({
  selector: 'sofie-attention-banner',
  templateUrl: './attention-banner.component.html',
  styleUrls: ['./attention-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionBannerComponent {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  @Input()
  public label: string

  @Input()
  public description?: string

  @Input()
  @HostBinding('class')
  public size: 'small' | 'medium' = 'medium'
}
