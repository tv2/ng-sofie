import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Part } from '../../../core/models/part'
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'sofie-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss'],
  animations: [
    trigger('onAirTrigger', [
      state('onAir', style({
        backgroundColor: 'red'
      })),
      state('offAir', style({

      })),
      state('isNext', style({
        backgroundColor: 'green'
      })),
      transition('offAir => onAir', animate(500)),
      transition('offAir => isNext', animate(500)),
      transition('onAir => isNext', animate(500))
    ]),
  ]
})
export class PartComponent {

  @Input()
  public isRundownActive: boolean

  @Input()
  public part: Part

  @Output()
  public readonly partSelectedAsNextEvent: EventEmitter<string> = new EventEmitter()

  public constructor() { return }

  public setPartAsNext(): void {
    this.partSelectedAsNextEvent.emit(this.part.id)
  }
}
