import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sofie-status-signal',
  templateUrl: './pulsating-dot.component.html',
  styleUrls: ['./pulsating-dot.component.scss']
})

export class PulsatingDotComponent {

  @Input()
  public animationDurationSeconds: string = '3'

  @Input()
  public color: string = 'red'

  constructor() { }
}
