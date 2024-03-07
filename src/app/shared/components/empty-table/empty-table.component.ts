import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-empty-table',
  templateUrl: './empty-table.component.html',
  styleUrls: ['./empty-table.component.scss'],
})
export class EmptyTableComponent {
  @Input() public text: string

  constructor() {}
}
