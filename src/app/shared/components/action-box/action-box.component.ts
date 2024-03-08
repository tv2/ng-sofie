import { Component, Input } from '@angular/core'
import { Tv2Action } from '../../models/tv2-action'

@Component({
  selector: 'sofie-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss'],
})
export class ActionBoxComponent {
  @Input() public action: Tv2Action
  @Input() public highLight: boolean

  constructor() {}
}
