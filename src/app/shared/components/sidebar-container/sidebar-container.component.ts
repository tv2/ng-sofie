import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.scss'],
})
export class SidebarContainerComponent {
  @Input() public title: string
}
