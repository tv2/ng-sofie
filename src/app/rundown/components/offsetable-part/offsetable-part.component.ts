import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-offsetable-part',
  templateUrl: './offsetable-part.component.html',
  styleUrls: ['./offsetable-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'offsetable-part' },
})
export class OffsetablePartComponent {
  @Input()
  public part: Part

  @Input()
  public pixelsPerSecond: number

  @Input()
  public offsetDurationInMs: number

  @Input()
  public minimumDisplayDurationInMs: number = 0

  public constructor(
      private readonly partEntityService: PartEntityService
  ) {}

  @HostBinding('style.width.px')
  public get hostWidthInPixels(): number {
    const partDurationInMs: number = this.partEntityService.getDuration(this.part)
    const displayDurationInMs: number = Math.max(partDurationInMs - this.offsetDurationInMs, this.minimumDisplayDurationInMs)
    return this.pixelsPerSecond * displayDurationInMs / 1000
  }
}
