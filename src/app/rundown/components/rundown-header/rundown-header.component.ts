import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Rundown} from "../../../core/models/rundown";
import {Piece} from "../../../core/models/piece";
import {ShowStyleVariantStateService} from "../../../core/services/show-style-variant-state.service";
import {ShowStyleVariant} from "../../../core/models/show-style-variant";
import {SubscriptionLike} from "rxjs";

@Component({
  selector: 'sofie-rundown-header',
  templateUrl: './rundown-header.component.html',
  styleUrls: ['./rundown-header.component.scss']
})
export class RundownHeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public rundown: Rundown

  public showStyleVariant: ShowStyleVariant
  public currentLocalDate: Date = new Date()
  private updateCurrentLocalDateIntervalId: ReturnType<typeof setInterval>
  private showStyleVariantSubscription?: SubscriptionLike

  public setupName: string = ''
  public schema: string = ''
  public design: string = ''

  constructor(private showStyleVariantStateService: ShowStyleVariantStateService) {}

  public ngOnInit(): void {
    this.updateCurrentLocalDateIntervalId = setInterval(() => {
      this.currentLocalDate = new Date()
    }, 1000)

    this.showStyleVariantStateService
        .subscribeToShowStyleVariant(this.rundown.id, (showStyleVariant) => {
          this.showStyleVariant = showStyleVariant
          this.setDefaultHeaderInformation()
        })
        .then(unsubscribeFromShowStyleVariant => {
          this.showStyleVariantSubscription = unsubscribeFromShowStyleVariant
        })
  }

  public ngOnDestroy() {
    clearInterval(this.updateCurrentLocalDateIntervalId)
    this.showStyleVariantSubscription?.unsubscribe()
  }
  public ngOnChanges(changes: SimpleChanges) {
    const rundownChange: SimpleChange = changes['rundown']
    if (rundownChange.currentValue.infinitePieces !== rundownChange.previousValue.infinitePieces) {
      this.setDesignFromInfinitePieces()
      this.setSchemaFromInfinitePieces()
    }
  }

  public getShortenedRundownName(): string {
    const rundownPathStrings: string[] = this.rundown?.name.split('.') ?? []
    return rundownPathStrings[rundownPathStrings.length - 1]
  }

  private setDefaultHeaderInformation(): void {
    const gfxDefaults = this.showStyleVariant.blueprintConfiguration.GfxDefaults[0]
    this.setupName = gfxDefaults.DefaultSetupName.label
    this.design = this.getNameFromTemplate(gfxDefaults.DefaultDesign.label)
    this.schema = this.getNameFromTemplate(gfxDefaults.DefaultSchema.label)
  }

  private setDesignFromInfinitePieces(): void {
    const infinitePieces: Piece[] = this.rundown.infinitePieces

    const designPiece: Piece | undefined = infinitePieces.find((piece) => this.getNameFromTemplate(piece.name) === 'DESIGN')
    if (designPiece) {
      this.design = designPiece.name
    }
  }

  private setSchemaFromInfinitePieces(): void {
    const infinitePieces: Piece[] = this.rundown.infinitePieces

    const schemaPiece: Piece | undefined = infinitePieces.find((piece) => this.getNameFromTemplate(piece.name) === 'SKEMA')
    if(schemaPiece) {
      this.schema = schemaPiece.name
    }
  }

  private getNameFromTemplate(template: string) {
    const nameParts: string[] = template.split('_')
    if (nameParts.length > 1) {
      return nameParts[1]
    }
    return nameParts[0]
  }
}
