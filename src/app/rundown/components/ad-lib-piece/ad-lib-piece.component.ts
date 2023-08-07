import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { AdLibPiece } from '../../../core/models/ad-lib-piece'

const CHECK_SHOULD_BE_SHOWN_INTERVAL_IN_MS: number = 1000

@Component({
  selector: 'sofie-ad-lib-piece',
  templateUrl: './ad-lib-piece.component.html',
  styleUrls: ['./ad-lib-piece.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdLibPieceComponent implements OnInit, OnDestroy {

  @Input()
  public adLibPiece: AdLibPiece
  public shouldShowPiece: boolean = true

  private interval: any

  constructor(private changeDetector: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.interval = setInterval(() => {
      const shouldBeShown: boolean = this.shouldBeShown()
      if (this.shouldShowPiece === shouldBeShown) {
        return
      }
      if (this.shouldShowPiece) {
        clearInterval(this.interval)
      }
      this.shouldShowPiece = shouldBeShown
      this.changeDetector.detectChanges()
    }, CHECK_SHOULD_BE_SHOWN_INTERVAL_IN_MS)
  }


  public shouldBeShown(): boolean {
    const now: number = new Date().getTime()
    const pieceEnd: number = this.adLibPiece.start + this.adLibPiece.duration
    return this.adLibPiece.start <= now && pieceEnd >= now
  }

  public ngOnDestroy(): void {
    clearInterval(this.interval)
  }
}
