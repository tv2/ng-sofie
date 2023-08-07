import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RundownComponent} from './components/rundown/rundown.component';

const routes: Routes = [
  {
    path: '',
    component: RundownComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RundownRoutesModule {}
