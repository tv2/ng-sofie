import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnChanges {

  @Input()
  public isRundownActive: boolean

  @Input()
  public segment: Segment

  @Output()
  setNextEvent: EventEmitter<{segmentId: string, partId: string}> = new EventEmitter()

  public pieceLayers: string[] = []

  public emitSetNextEvent(partId: string): void {
    this.setNextEvent.emit({ segmentId: this.segment.id, partId})
  }

  public ngOnChanges(): void {
    this.pieceLayers = this.getPieceLayers()
  }

  private getPieceLayers(): string[] {
    return [
      'OVERLAY',
      'PGM',
      'MANUS',
    ]
  }
}
