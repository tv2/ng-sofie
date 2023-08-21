import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Paths } from '../../../app-routing.module'
import { RundownPlaylistService } from '../../../core/services/rundown-playlist.service';
import { BasicRundown } from "../../../core/models/BasicRundown";
import { Color } from "../../../shared/enums/color";

@Component({
  selector: 'sofie-rundown-overview',
  templateUrl: './rundown-overview.component.html',
  styleUrls: ['./rundown-overview.component.scss']
})
export class RundownOverviewComponent implements OnInit {

  public basicRundowns: BasicRundown[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rundownPlaylistService: RundownPlaylistService
  ) { }

  public ngOnInit(): void {
    this.rundownPlaylistService.fetchBasicRundowns().subscribe((rundownIdentifiers: BasicRundown[]) => {
      this.basicRundowns = rundownIdentifiers
    })
  }

  public navigateToRundown(basicRundown: BasicRundown): void {
    this.router.navigate([Paths.RUNDOWNS, basicRundown.id])
  }

  protected readonly Color = Color;
}
