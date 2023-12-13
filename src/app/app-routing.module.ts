import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

export enum Paths {
  HOME = '',
  RUNDOWNS = 'rundowns',
  STATUS = 'status',
}

const routes: Routes = [
  {
    path: Paths.HOME,
    loadChildren: () => import('./rundown-overview/rundown-overview.module').then(module => module.RundownOverviewModule),
  },
  {
    path: Paths.RUNDOWNS,
    loadChildren: () => import('./rundown-overview/rundown-overview.module').then(module => module.RundownOverviewModule),
  },
  {
    path: `${Paths.RUNDOWNS}/:rundownId`,
    loadChildren: () => import('./rundown-view/rundown-view.module').then(module => module.RundownViewModule),
  },
  {
    path: `${Paths.STATUS}`,
    loadChildren: () => import('./status-overview/status-overview.module').then(module => module.StatusOverviewModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
