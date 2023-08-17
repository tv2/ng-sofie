import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Paths} from '../../../app-routing.module'
import {RundownPlaylistService} from '../../../core/services/rundown-playlist.service';
import {BasicRundown} from "../../../core/models/BasicRundown";
import { RundownService } from '../../../core/services/rundown.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../../shared/services/confirmation-dialog.service';

@Component({
  selector: 'sofie-rundown-playlists',
  templateUrl: './rundown-overview.component.html',
  styleUrls: ['./rundown-overview.component.scss']
})
export class RundownOverviewComponent implements OnInit {

  public basicRundowns: BasicRundown[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rundownPlaylistService: RundownPlaylistService,
    private rundownService: RundownService,
    private dialog: ConfirmationDialogService
  ) { }

  public ngOnInit(): void {
    this.rundownPlaylistService.fetchBasicRundowns().subscribe((rundownIdentifiers: BasicRundown[]) => {
      this.basicRundowns = rundownIdentifiers
    })
  }

  public navigateToRundown(basicRundown: BasicRundown): void {
    this.router.navigate([Paths.RUNDOWNS, basicRundown.id])
  }

  public openDeletionDialog(basicRundown: BasicRundown): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete rundown?',
        message: `Are you sure you want to delete the "${basicRundown.name}" rundown?\n\nPlease note: This action is irreversible!`,
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      },
    }).afterClosed().subscribe(result => {
      if (!result) return
      this.deleteRundown(basicRundown.id)
    });
  }

  private deleteRundown(rundownId: string): void {
    this.rundownService.delete(rundownId).subscribe()
  }
}
