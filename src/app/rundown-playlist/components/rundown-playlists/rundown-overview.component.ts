import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {Paths} from '../../../app-routing.module'
import {RundownPlaylistService} from '../../../core/services/rundown-playlist.service';
import {BasicRundown} from "../../../core/models/BasicRundown";
import { RundownService } from '../../../core/services/rundown.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Rundown } from '../../../core/models/rundown';

@Component({
  selector: 'sofie-rundown-playlists',
  templateUrl: './rundown-overview.component.html',
  styleUrls: ['./rundown-overview.component.scss']
})
export class RundownOverviewComponent implements OnInit {

  public basicRundowns: BasicRundown[]

  constructor(
    private router: Router,
    private rundownPlaylistService: RundownPlaylistService,
    private rundownService: RundownService,
    private dialogService: DialogService
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
    this.dialogService.openDeletionDialog(Rundown.name, basicRundown.name, () => this.deleteRundown(basicRundown.id))
  }

  private deleteRundown(rundownId: string): void {
    this.rundownService.delete(rundownId).subscribe()
  }
}
