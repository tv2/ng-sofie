import { Component, Input } from '@angular/core'
import { ContextMenuOption } from '../../../shared/abstractions/context-menu-option'
import { Part } from '../../../core/models/part'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-segment-context-menu',
  templateUrl: './segment-context-menu.component.html',
})
export class SegmentContextMenuComponent {
  @Input()
  public segment: Segment

  public readonly contextMenuOptions: ContextMenuOption[] = [
    {
      label: 'Set segment as Next',
      contextAction: (): void => this.setFirstValidPartAsNext(),
    },
  ]

  constructor(private readonly rundownService: RundownService) {}

  public setFirstValidPartAsNext(): void {
    if (this.segment.isOnAir) {
      return
    }

    const firstValidPart: Part | undefined = this.segment.parts.find(part => part.pieces.length > 0)
    if (!firstValidPart) {
      return
    }
    this.rundownService.setNext(this.segment.rundownId, this.segment.id, firstValidPart.id).subscribe()
  }
}
