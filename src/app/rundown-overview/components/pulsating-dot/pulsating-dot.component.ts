import {Component, Input} from '@angular/core';
import {PulsatingDotColor} from "../../../shared/enums/pulsating-dot-color";

@Component({
  selector: 'sofie-pulsating-dot',
  templateUrl: './pulsating-dot.component.html',
  styleUrls: ['./pulsating-dot.component.scss']
})

export class PulsatingDotComponent {

  @Input()
  public animationDurationSeconds: number = 3

  @Input()
  public color: PulsatingDotColor = PulsatingDotColor.RED

  constructor() { }
}
