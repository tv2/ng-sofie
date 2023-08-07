import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Paths} from '../../../app-routing.module'
import {Identifier} from '../../../core/models/identifier'
import {RundownPlaylistService} from '../../../core/services/rundown-playlist.service';

@Component({
  selector: 'sofie-rundown-playlists',
  templateUrl: './rundown-playlists.component.html',
  styleUrls: ['./rundown-playlists.component.scss']
})
export class RundownPlaylistsComponent implements OnInit {

  public rundownIdentifiers: Identifier[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rundownPlaylistService: RundownPlaylistService
  ) { }

  public ngOnInit(): void {
    this.rundownPlaylistService.fetchRundownPlaylistIdentifiers().subscribe((rundownIdentifiers: Identifier[]) => {
      this.rundownIdentifiers = rundownIdentifiers
    })
  }

  public navigateToRundown(rundownIdentifier: Identifier): void {
    this.router.navigate([Paths.RUNDOWNS, rundownIdentifier.id])
  }
}
