import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RundownOverviewComponent} from './components/rundown-playlists/rundown-overview.component';

const routes: Routes = [
  {
    path: '',
    component: RundownOverviewComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RundownOverviewRoutingModule {}
