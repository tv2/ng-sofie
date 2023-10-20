import { Component, Input } from '@angular/core'
import { ContextMenuOption } from '../../abstractions/context-menu-option'

@Component({
  selector: 'sofie-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  @Input()
  public contextMenuOptions: ContextMenuOption[]

  @Input()
  public contextMenuHeader?: string
}
