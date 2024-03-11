import { Component, Input } from '@angular/core'
import { Color } from '../../../shared/enums/color'

@Component({
  selector: 'sofie-pulsating-dot',
  templateUrl: './pulsating-dot.component.html',
  styleUrls: ['./pulsating-dot.component.scss'],
})
export class PulsatingDotComponent {
  @Input()
  public animationDurationSeconds: number = 3

  @Input()
  public color: Color = Color.ON_AIR

  constructor() {}
}
