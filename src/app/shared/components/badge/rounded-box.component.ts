import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-rounded-box',
  templateUrl: './rounded-box.component.html',
  styleUrls: ['./rounded-box.component.scss'],
})
export class RoundedBoxComponent {
  @Input() public textColor: string
  @Input() public backgroundColor: string

  constructor() {}
}
