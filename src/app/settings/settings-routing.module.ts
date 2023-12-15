import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SettingsComponent } from './components/settings/settings.component'
import { ClearCacheComponent } from './components/clear-cache/clear-cache.component'

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'action-triggers', pathMatch: 'full' },
      { path: 'action-triggers', loadChildren: () => import('./action-triggers/action-triggers.module').then(module => module.ActionTriggersModule) },
      { path: 'clear-cache', component: ClearCacheComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
