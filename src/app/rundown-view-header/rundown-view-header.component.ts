import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Rundown} from "../core/models/rundown";
import {Piece} from "../core/models/piece";

@Component({
  selector: 'sofie-rundown-view-header',
  templateUrl: './rundown-view-header.component.html',
  styleUrls: ['./rundown-view-header.component.scss']
})
export class RundownViewHeaderComponent implements OnInit, OnDestroy {
  @Input()
  public rundown?: Rundown

  public localTime: Date = new Date()
  private localTimeIntervalId: NodeJS.Timer
  constructor() { }

  ngOnInit(): void {
    this.localTimeIntervalId = setInterval(() => {
      this.localTime = new Date()
    }, 1000)
  }

  ngOnDestroy() {
    clearInterval(this.localTimeIntervalId)
  }

  public getShortenedRundownName(): string {
    const rundownPathStrings: string[] = this.rundown?.name.split('.') ?? []
    return rundownPathStrings[rundownPathStrings.length - 1]
  }

  //TODO: find a better solution for determining whether infinite pieces are schemas or designs
  public getDesign(): string {
    const infinitePieces: Piece[] = this.rundown?.getInfinitePieces() ?? []
    if (!infinitePieces) {
      return ''
    }
    const designPiece: Piece | undefined = infinitePieces.find((piece) => piece.name.split('_')[0] === 'DESIGN')
    return designPiece?.name ?? ''
  }

  public getSchema(): string {
    const infinitePieces: Piece[] = this.rundown?.getInfinitePieces() ?? []
    if (!infinitePieces) {
      return ''
    }
    const schemaPiece: Piece | undefined = infinitePieces.find((piece) => piece.name.split('_')[0] === 'SKEMA')
    return schemaPiece?.name ?? ''
  }
}
