import { Component, OnDestroy, OnInit } from '@angular/core'
import { Paths } from '../../../app-routing.module'
import { BasicRundown } from '../../../core/models/basic-rundown'
import { DialogService } from '../../../shared/services/dialog.service'
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'
import { SubscriptionLike } from 'rxjs'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownTimingType } from '../../../core/enums/rundown-timing-type'
import { BackwardRundownTiming } from '../../../core/models/rundown-timing'
import { RundownMode } from '../../../core/enums/rundown-mode'
import { SofieTableHeader, SortDirection } from '../../../shared/components/table/table.component'

@Component({
  selector: 'sofie-rundown-overview',
  templateUrl: './rundown-overview.component.html',
})
export class RundownOverviewComponent implements OnInit, OnDestroy {
  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
  protected readonly RundownMode = RundownMode

  public readonly headers: SofieTableHeader<BasicRundown>[] = [
    {
      name: '',
      sortCallback: (): number => 0,
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`rundown-overview-component.rundown-label`,
      sortCallback: (a: BasicRundown, b: BasicRundown): number => a.name.localeCompare(b.name),
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`rundown-overview-component.planned-start`,
      sortCallback: (a: BasicRundown, b: BasicRundown): number => (this.getPlannedStart(a) ?? 0) - (this.getPlannedStart(b) ?? 0),
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`rundown-overview-component.duration`,
      sortCallback: (a: BasicRundown, b: BasicRundown): number => (this.getDurationInMs(a) ?? 0) - (this.getDurationInMs(b) ?? 0),
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`rundown-overview-component.planned-end`,
      sortCallback: (a: BasicRundown, b: BasicRundown): number => (this.getPlannedEnd(a) ?? 0) - (this.getPlannedEnd(b) ?? 0),
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`rundown-overview-component.last-updated.label`,
      sortCallback: (a: BasicRundown, b: BasicRundown): number => a.modifiedAt - b.modifiedAt,
      sortDirection: SortDirection.DESC,
    },
  ]

  public basicRundowns: BasicRundown[] = []
  public isLoading: boolean = true
  private subscriptions: SubscriptionLike[] = []
  private readonly logger: Logger

  protected readonly Paths = Paths

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
