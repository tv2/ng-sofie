import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RundownPlaylistsComponent} from './components/rundown-playlists/rundown-playlists.component';

const routes: Routes = [
  {
    path: '',
    component: RundownPlaylistsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RundownPlaylistRoutingModule {}
