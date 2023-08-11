import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RundownPlaylistsComponent} from './components/rundown-playlists/rundown-playlists.component';
import {RundownPlaylistRoutingModule} from './rundown-playlist-routing.module';


@NgModule({
  declarations: [
    RundownPlaylistsComponent
  ],
  imports: [
    RundownPlaylistRoutingModule,
    SharedModule
  ]
})
export class RundownPlaylistModule { }
