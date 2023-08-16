import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sofie-status-signal',
  templateUrl: './status-signal.component.html',
  styleUrls: ['./status-signal.component.scss']
})

export class StatusSignalComponent {

  @Input()
  animationDurationSeconds: string = '3'

  @Input()
  public color: string = 'red'

  constructor() { }
}
