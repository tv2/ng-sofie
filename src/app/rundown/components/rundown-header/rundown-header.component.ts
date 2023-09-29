import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Rundown} from "../../../core/models/rundown";
import {Piece} from "../../../core/models/piece";

@Component({
  selector: 'sofie-rundown-header',
  templateUrl: './rundown-header.component.html',
  styleUrls: ['./rundown-header.component.scss']
})
export class RundownHeaderComponent implements OnInit, OnDestroy {
  @Input()
  public rundown?: Rundown

  public currentLocalDate: Date = new Date()
  private updateCurrentLocalDateIntervalId: NodeJS.Timer
  constructor() { }

  ngOnInit(): void {
    this.updateCurrentLocalDateIntervalId = setInterval(() => {
      this.currentLocalDate = new Date()
    }, 1000)
  }

  ngOnDestroy() {
    clearInterval(this.updateCurrentLocalDateIntervalId)
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
