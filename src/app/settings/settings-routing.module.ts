import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SettingsComponent } from './components/settings/settings.component'
import { ClearCacheComponent } from './components/clear-cache/clear-cache.component'

export enum SettingsPaths {
  SETTINGS = '',
  KEYBOARD_MAPPINGS = 'keyboard-mappings',
  CLEAR_CACHE = 'clear-cache',
}

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: SettingsPaths.SETTINGS, redirectTo: SettingsPaths.KEYBOARD_MAPPINGS, pathMatch: 'full' },
      { path: SettingsPaths.KEYBOARD_MAPPINGS, loadChildren: () => import('./action-triggers/action-triggers.module').then(module => module.ActionTriggersModule) },
      { path: SettingsPaths.CLEAR_CACHE, component: ClearCacheComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
