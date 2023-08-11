import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Paths} from '../../../app-routing.module'
import {Identifier} from '../../../core/models/identifier'
import {RundownPlaylistService} from '../../../core/services/rundown-playlist.service';
import {BasicRundown} from "../../../core/models/BasicRundown";

@Component({
  selector: 'sofie-rundown-playlists',
  templateUrl: './rundown-playlists.component.html',
  styleUrls: ['./rundown-playlists.component.scss']
})
export class RundownPlaylistsComponent implements OnInit {

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
}
