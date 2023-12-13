import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { StatusOverviewComponent } from './components/status-overview/status-overview.component'

const routes: Routes = [
  {
    path: '',
    component: StatusOverviewComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusOverviewRoutesModule {}
