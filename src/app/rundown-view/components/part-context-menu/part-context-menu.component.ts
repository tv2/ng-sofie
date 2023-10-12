import { Component, Input } from '@angular/core'
import { Part } from '../../../core/models/part'
import { ContextMenuOption } from '../../../shared/abstractions/context-menu-option'
import { RundownService } from '../../../core/abstractions/rundown.service'

@Component({
  selector: 'sofie-part-context-menu',
  templateUrl: './part-context-menu.component.html',
})
export class PartContextMenuComponent {
  @Input()
  public part: Part

  @Input()
  public rundownId: string

  @Input()
  public isRundownActive: boolean

  protected readonly contextMenuOptions: ContextMenuOption[] = [
    {
      label: 'Set part as next',
      contextAction: (): void => this.setPartAsNext(),
    },
  ]

  constructor(private readonly rundownService: RundownService) {}

  public setPartAsNext(): void {
    this.rundownService.setNext(this.rundownId, this.part.segmentId, this.part.id).subscribe()
  }
}
