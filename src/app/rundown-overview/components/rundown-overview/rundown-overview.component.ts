import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Paths } from '../../../app-routing.module'
import { BasicRundown } from '../../../core/models/basic-rundown'
import { DialogService } from '../../../shared/services/dialog.service'
import { Color } from '../../../shared/enums/color'
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'
import { SubscriptionLike } from 'rxjs'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'
import { Logger } from '../../../core/abstractions/logger.service'

@Component({
  selector: 'sofie-rundown-overview',
  templateUrl: './rundown-overview.component.html',
  styleUrls: ['./rundown-overview.component.scss'],
})
export class RundownOverviewComponent implements OnInit, OnDestroy {
  public basicRundowns: BasicRundown[] = []
  public isLoading: boolean = true
  private subscriptions: SubscriptionLike[] = []
  private readonly logger: Logger

  constructor(
    private readonly router: Router,
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

  public navigateToRundown(basicRundown: BasicRundown): void {
    const segmentedPath: string[] = [Paths.RUNDOWNS, basicRundown.id]
    this.router.navigate(segmentedPath).catch(error => this.logger.data(error).warn(`Failed navigating to /${segmentedPath.join('/')}.`))
  }

  public openDeletionDialog(basicRundown: BasicRundown): void {
    this.dialogService.createConfirmDialog(
      $localize`rundown-overview-component.deletion-dialog-tittle:Delete Rundown?`,
      $localize`rundown-overview-component.deletion-dialog-question:Are you sure you want to delete the Rundown "${basicRundown.name}"?\n\nPlease note: This action is irreversible!`,
      $localize`rundown-overview-component.deletion-dialog.delete-button:Delete`,
      () => this.deleteRundown(basicRundown.id)
    )
  }

  private deleteRundown(rundownId: string): void {
    this.rundownService.delete(rundownId).subscribe()
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  public readonly Color = Color
  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
}
