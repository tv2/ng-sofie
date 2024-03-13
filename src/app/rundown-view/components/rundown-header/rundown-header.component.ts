import { RundownMode } from './../../../core/enums/rundown-mode'
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Piece } from '../../../core/models/piece'
import { ShowStyleVariantStateService } from '../../../core/services/show-style-variant-state.service'
import { ShowStyleVariant } from '../../../core/models/show-style-variant'
import { Subscription } from 'rxjs'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { RundownTimingContext } from '../../../core/models/rundown-timing-context'

const DESIGN_TEMPLATE_IDENTIFIER: string = 'DESIGN_'
const SKEMA_TEMPLATE_IDENTIFIER: string = 'SKEMA_'

@Component({
  selector: 'sofie-rundown-header',
  templateUrl: './rundown-header.component.html',
  styleUrls: ['./rundown-header.component.scss'],
})
export class RundownHeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public rundown: Rundown

  public showStyleVariant?: ShowStyleVariant
  public currentLocalDate: number

  public rundownName: string = ''
  public rundownPath: string = ''
  public schema: string = ''
  public design: string = ''
  public plannedStart?: number
  public plannedEnd: number = Date.now()
  public diff: number = 0

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
  protected readonly RundownMode = RundownMode

  private showStyleVariantSubscription?: Subscription
  private rundownTimingContextSubscription?: Subscription
  private readonly logger: Logger

  public elementRef: ElementRef

  constructor(
    elementRef: ElementRef,
    private readonly showStyleVariantStateService: ShowStyleVariantStateService,
    private readonly rundownTimingContextStateService: RundownTimingContextStateService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownHeaderComponent')
    this.elementRef = elementRef
  }

  public ngOnInit(): void {
    this.setRundownNameAndPath()

    this.showStyleVariantStateService
      .subscribeToShowStyleVariant(this.rundown.id)
      .then(showStyleVariantObservable => showStyleVariantObservable.subscribe(this.onShowStyleVariantChanged.bind(this)))
      .then(unsubscribeFromShowStyleVariant => (this.showStyleVariantSubscription = unsubscribeFromShowStyleVariant))
      .catch(error => this.logger.data(error).error('Failed subscribing to show style variant changes.'))

    this.rundownTimingContextStateService
      .subscribeToRundownTimingContext(this.rundown.id)
      .then(rundownTimingContextObservable => rundownTimingContextObservable.subscribe(this.onRundownTimingContextChanged.bind(this)))
      .then(rundownTimingContextSubscription => (this.rundownTimingContextSubscription = rundownTimingContextSubscription))
      .catch(error => this.logger.data(error).error('Failed subscribing to rundown timing context changes.'))
  }

  private onShowStyleVariantChanged(showStyleVariant: ShowStyleVariant): void {
    this.showStyleVariant = showStyleVariant
    this.setDefaultHeaderInformation()
  }

  private setRundownNameAndPath(): void {
    const rundownPathSegments: string[] = this.rundown.name.split('.')
    if (rundownPathSegments.length === 0) {
      return
    }
    this.rundownPath = rundownPathSegments.slice(0, -1).join('.')
    this.rundownName = rundownPathSegments[rundownPathSegments.length - 1]
  }

  public ngOnDestroy(): void {
    this.showStyleVariantSubscription?.unsubscribe()
    this.rundownTimingContextSubscription?.unsubscribe()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const rundownChange: SimpleChange = changes['rundown']
    if (rundownChange.currentValue.infinitePieces.length > 0 && rundownChange.currentValue.infinitePieces !== rundownChange.previousValue?.infinitePieces) {
      this.setDesignFromInfinitePieces()
      this.setSchemaFromInfinitePieces()
    }
  }

  private setDefaultHeaderInformation(): void {
    if (!this.showStyleVariant) {
      return
    }
    const gfxDefaults = this.showStyleVariant.blueprintConfiguration.GfxDefaults[0]
    this.design = this.getGfxNameFromTemplate(gfxDefaults.DefaultDesign.label)
    this.schema = this.getGfxNameFromTemplate(gfxDefaults.DefaultSchema.label)
  }

  private setDesignFromInfinitePieces(): void {
    const infinitePieces: Piece[] = this.rundown.infinitePieces

    const designPiece: Piece | undefined = infinitePieces.find(piece => this.isDesignInfinitePiece(piece))
    if (designPiece) {
      this.design = designPiece.name
    }
  }

  private setSchemaFromInfinitePieces(): void {
    const infinitePieces: Piece[] = this.rundown.infinitePieces

    const schemaPiece: Piece | undefined = infinitePieces.find(piece => this.isSkemaInfinitePiece(piece))
    if (schemaPiece) {
      this.schema = schemaPiece.name
    }
  }

  private isDesignInfinitePiece(piece: Piece): boolean {
    return piece.name.startsWith(DESIGN_TEMPLATE_IDENTIFIER)
  }

  private isSkemaInfinitePiece(piece: Piece): boolean {
    return piece.name.startsWith(SKEMA_TEMPLATE_IDENTIFIER)
  }

  private getGfxNameFromTemplate(template: string): string {
    const pattern: RegExp = /^.+_(?<gfxName>\w+)$/
    const { gfxName } = template.match(pattern)?.groups ?? {}
    return gfxName ?? template
  }

  private onRundownTimingContextChanged(rundownTimingContext: RundownTimingContext): void {
    this.currentLocalDate = rundownTimingContext.currentEpochTime
    this.plannedStart = rundownTimingContext.expectedStartEpochTimeForRundown
    this.plannedEnd = rundownTimingContext.expectedEndEpochTimeForRundown
    if (this.rundown.mode === RundownMode.ACTIVE || this.rundown.mode === RundownMode.REHEARSAL) {
      this.diff = rundownTimingContext.currentEpochTime + rundownTimingContext.remainingDurationInMsForRundown - rundownTimingContext.expectedEndEpochTimeForRundown
    } else {
      this.diff = rundownTimingContext.currentEpochTime + rundownTimingContext.expectedDurationInMsForRundown - rundownTimingContext.expectedEndEpochTimeForRundown
    }
  }
}
