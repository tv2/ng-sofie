import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Piece } from '../../../core/models/piece'
import { ShowStyleVariantStateService } from '../../../core/services/show-style-variant-state.service'
import { ShowStyleVariant } from '../../../core/models/show-style-variant'
import { SubscriptionLike } from 'rxjs'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownTimingService } from '../../../core/services/rundown-timing.service'

const TIME_RESOLUTION_INTERVAL: number = 1000
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
  public currentLocalDate: Date = new Date()
  private timeResolutionIntervalId: ReturnType<typeof setInterval>
  private showStyleVariantSubscription?: SubscriptionLike
  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize

  public rundownName: string = ''
  public rundownPath: string = ''
  public schema: string = ''
  public design: string = ''
  public plannedStart?: number
  public plannedEnd: number = Date.now()
  public diff: number = 0

  private readonly logger: Logger

  constructor(
    private readonly showStyleVariantStateService: ShowStyleVariantStateService,
    private readonly rundownTimingService: RundownTimingService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownHeaderComponent')
  }

  public ngOnInit(): void {
    this.setRundownNameAndPath()
    this.timeResolutionIntervalId = setInterval(this.onTimeResolutionUpdated.bind(this), TIME_RESOLUTION_INTERVAL)

    this.showStyleVariantStateService
      .subscribeToShowStyleVariant(this.rundown.id, showStyleVariant => {
        this.showStyleVariant = showStyleVariant
        this.setDefaultHeaderInformation()
      })
      .then(unsubscribeFromShowStyleVariant => (this.showStyleVariantSubscription = unsubscribeFromShowStyleVariant))
      .catch(error => this.logger.data(error).error('Failed subscribing to show style variant changes.'))
  }

  private setRundownNameAndPath(): void {
    const rundownPathSegments: string[] = this.rundown.name.split('.')
    if (rundownPathSegments.length === 0) {
      return
    }
    this.rundownPath = rundownPathSegments.slice(0, -1).join('.')
    this.rundownName = rundownPathSegments[rundownPathSegments.length - 1]
  }

  private onTimeResolutionUpdated(): void {
    this.currentLocalDate = new Date()
    this.setRundownTiming()
  }

  public ngOnDestroy(): void {
    clearInterval(this.timeResolutionIntervalId)
    this.showStyleVariantSubscription?.unsubscribe()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const rundownChange: SimpleChange = changes['rundown']
    if (rundownChange.currentValue.infinitePieces.length > 0 && rundownChange.currentValue.infinitePieces !== rundownChange.previousValue?.infinitePieces) {
      this.setDesignFromInfinitePieces()
      this.setSchemaFromInfinitePieces()
    }

    if (rundownChange) {
      this.setRundownTiming()
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

  private setRundownTiming(): void {
    this.plannedStart = this.rundownTimingService.getExpectedStartEpochTime(this.rundown.timing)
    this.plannedEnd = this.rundownTimingService.getEndEpochTime(this.rundown)
    this.diff = this.rundownTimingService.getRundownScheduleOffsetInMs(this.rundown)
  }
}
