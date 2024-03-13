import { Component, OnDestroy, OnInit } from '@angular/core'
import { Paths } from '../../../app-routing.module'
import { BasicRundown } from '../../../core/models/basic-rundown'
import { DialogService } from '../../../shared/services/dialog.service'
import { Color } from '../../../shared/enums/color'
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'
import { SubscriptionLike } from 'rxjs'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownTimingType } from '../../../core/enums/rundown-timing-type'
import { BackwardRundownTiming } from '../../../core/models/rundown-timing'
import { RundownMode } from '../../../core/enums/rundown-mode'

@Component({
  selector: 'sofie-rundown-overview',
  templateUrl: './rundown-overview.component.html',
  styleUrls: ['./rundown-overview.component.scss'],
})
export class RundownOverviewComponent implements OnInit, OnDestroy {
  protected readonly Color = Color
  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
  protected readonly RundownMode = RundownMode
  protected readonly Paths = Paths

  public basicRundowns: BasicRundown[] = []
  public isLoading: boolean = true
  private subscriptions: SubscriptionLike[] = []
  private readonly logger: Logger

  constructor(
    private readonly basicRundownStateService: BasicRundownStateService,
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownOverviewComponent')
  }

  public ngOnInit(): void {
    const basicRundownSubscription: SubscriptionLike = this.basicRundownStateService.subscribeToBasicRundowns(basicRundowns => {
      this.basicRundowns = basicRundowns
      this.logger.data(basicRundowns).debug('Updated basicRundowns for rundown overview.')
    })
    const isLoadingSubscription: SubscriptionLike = this.basicRundownStateService.subscribeToLoading(isLoading => (this.isLoading = isLoading))
    this.subscriptions = [basicRundownSubscription, isLoadingSubscription]
  }

  public openDeletionDialog(basicRundown: BasicRundown): void {
    this.dialogService.createConfirmDialog(
      $localize`rundown-overview-component.deletion-dialog-title`,
      $localize`rundown-overview-component.deletion-dialog-question "${basicRundown.name}"`,
      $localize`rundown-overview-component.deletion-dialog.delete-button`,
      () => this.deleteRundown(basicRundown.id)
    )
  }

  private deleteRundown(rundownId: string): void {
    this.rundownService.delete(rundownId).subscribe()
  }

  public getPlannedStart(basicRundown: BasicRundown): number | undefined {
    switch (basicRundown.timing.type) {
      case RundownTimingType.FORWARD:
        return basicRundown.timing.expectedStartEpochTime
      case RundownTimingType.BACKWARD:
        return this.getExpectedStartFromBackwardRundownTiming(basicRundown.timing)
      default:
        return undefined
    }
  }

  private getExpectedStartFromBackwardRundownTiming(backwardRundownTiming: BackwardRundownTiming): number | undefined {
    if (backwardRundownTiming.expectedStartEpochTime) {
      return backwardRundownTiming.expectedStartEpochTime
    }

    if (backwardRundownTiming.expectedDurationInMs) {
      return backwardRundownTiming.expectedEndEpochTime - backwardRundownTiming.expectedDurationInMs
    }

    return undefined
  }

  public getDurationInMs(basicRundown: BasicRundown): number | undefined {
    return basicRundown.timing.expectedDurationInMs
  }

  public getPlannedEnd(basicRundown: BasicRundown): number | undefined {
    switch (basicRundown.timing.type) {
      case RundownTimingType.FORWARD:
      case RundownTimingType.BACKWARD:
        return basicRundown.timing.expectedEndEpochTime
      default:
        return undefined
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
