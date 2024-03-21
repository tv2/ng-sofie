import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-pulsating-dot',
  templateUrl: './pulsating-dot.component.html',
  styleUrls: ['./pulsating-dot.component.scss'],
})
export class PulsatingDotComponent {
  @Input()
  public animationDurationSeconds: number = 3

  @Input()
  public color: 'ON_AIR' | 'REHEARSAL' = 'ON_AIR'

  public getColor(): string {
    switch (this.color) {
      case 'ON_AIR': {
        return 'var(--on-air-color)'
      }
      case 'REHEARSAL': {
        return 'var(--rehearsal-color)'
      }
    }
  }
}
