import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RundownViewComponent } from './components/rundown-view/rundown-view.component'

const routes: Routes = [
  {
    path: '',
    component: RundownViewComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RundownViewRoutesModule {}
