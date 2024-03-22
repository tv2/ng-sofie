import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'
import { Tv2Action } from '../../../shared/models/tv2-action'

@Component({
  selector: 'sofie-tv2-action-card',
  templateUrl: './tv2-action-card.component.html',
  styleUrls: ['./tv2-action-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tv2ActionCardComponent {
  @Input()
  public action: Tv2Action

  @HostBinding('class')
  public get getPieceTypeModifierClass(): string {
    return this.getActionContentType()
  }

  private getActionContentType(): string {
    return this.action.metadata.contentType.toLowerCase().replace('_', '-')
  }
}
