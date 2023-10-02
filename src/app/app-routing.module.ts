import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'

export enum Paths {
  HOME = '',
  RUNDOWNS = 'rundowns'
}

const routes: Routes = [
  {
    path: Paths.HOME,
    loadChildren: () => import('./rundown-overview/rundown-overview.module').then(m => m.RundownOverviewModule)
  },
  {
    path: Paths.RUNDOWNS,
    loadChildren: () => import('./rundown-overview/rundown-overview.module').then(m => m.RundownOverviewModule)
  },
  {
    path: `${Paths.RUNDOWNS}/:rundownId`,
    loadChildren: () => import('./rundown/rundown.module').then(m => m.RundownModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
