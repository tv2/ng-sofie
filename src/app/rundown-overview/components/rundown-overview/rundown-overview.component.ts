import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Paths } from '../../../app-routing.module'
import { BasicRundown } from "../../../core/models/basic-rundown";
import { Rundown } from '../../../core/models/rundown';
import { DialogService } from '../../../shared/services/dialog.service';
import { Color } from "../../../shared/enums/color";
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'
import { SubscriptionLike } from 'rxjs'
import { RundownService } from '../../../core/abstractions/rundown.service'

@Component({
  selector: 'sofie-rundown-overview',
  templateUrl: './rundown-overview.component.html',
  styleUrls: ['./rundown-overview.component.scss']
})
export class RundownOverviewComponent implements OnInit, OnDestroy {
  public basicRundowns: BasicRundown[] = []
  public isLoading: boolean = true
  private subscriptions: SubscriptionLike[] = []

  constructor(
    private readonly router: Router,
    private readonly basicRundownStateService: BasicRundownStateService,
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    const basicRundownSubscription: SubscriptionLike = this.basicRundownStateService.subscribeToBasicRundowns(basicRundowns => {
      console.log('[debug]: Updates basicRundowns for rundown overview', basicRundowns)
      this.basicRundowns = basicRundowns
    })
    const isLoadingSubscription: SubscriptionLike = this.basicRundownStateService.subscribeToLoading(isLoading => this.isLoading = isLoading)
    this.subscriptions = [basicRundownSubscription, isLoadingSubscription]
  }

  public navigateToRundown(basicRundown: BasicRundown): void {
    this.router.navigate([Paths.RUNDOWNS, basicRundown.id])
  }

  public openDeletionDialog(basicRundown: BasicRundown): void {
    this.dialogService.openDeletionDialog(Rundown.name, basicRundown.name, () => this.deleteRundown(basicRundown.id))
  }

  private deleteRundown(rundownId: string): void {
    this.rundownService.delete(rundownId).subscribe()
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  public readonly Color = Color;
}
