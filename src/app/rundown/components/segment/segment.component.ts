import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent {

  @Input()
  public isRundownActive: boolean

  @Input()
  public segment: Segment

  @Output()
  setNextEvent: EventEmitter<{segmentId: string, partId: string}> = new EventEmitter()

  constructor() { }

  public emitSetNextEvent(partId: string): void {
    this.setNextEvent.emit({ segmentId: this.segment.id, partId})
  }
}
