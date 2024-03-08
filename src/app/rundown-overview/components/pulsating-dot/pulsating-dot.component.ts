import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-pulsating-dot',
  templateUrl: './pulsating-dot.component.html',
  styleUrls: ['./pulsating-dot.component.scss'],
})
export class PulsatingDotComponent {
  @Input()
  public animationDurationSeconds: number = 3

  public color: string = 'var(--on-air-color)'

  constructor() {}
}
