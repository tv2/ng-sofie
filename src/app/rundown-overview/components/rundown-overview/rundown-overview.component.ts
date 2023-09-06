import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Paths } from '../../../app-routing.module'
import { BasicRundown } from "../../../core/models/basic-rundown";
import { HttpRundownService } from '../../../core/services/http-rundown.service';
import { Rundown } from '../../../core/models/rundown';
import { DialogService } from '../../../shared/services/dialog.service';
import { Color } from "../../../shared/enums/color";
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'

@Component({
  selector: 'sofie-rundown-overview',
  templateUrl: './rundown-overview.component.html',
  styleUrls: ['./rundown-overview.component.scss']
})
export class RundownOverviewComponent implements OnInit {

  public basicRundowns: BasicRundown[]

  constructor(
    private readonly router: Router,
    private readonly basicRundownStateService: BasicRundownStateService,
    private readonly rundownService: HttpRundownService,
    private readonly dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    this.basicRundownStateService.subscribeToBasicRundowns(basicRundowns => {
      console.log('[debug]: Updates basicRundowns for rundown overview', basicRundowns)
      this.basicRundowns = basicRundowns
    })
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

  public readonly Color = Color;
}
