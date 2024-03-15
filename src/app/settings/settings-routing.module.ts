import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SettingsComponent } from './components/settings/settings.component'
import { ClearCacheComponent } from './components/clear-cache/clear-cache.component'

export enum SettingsPath {
  SETTINGS = '',
  KEYBOARD_MAPPINGS = 'keyboard-mapping',
  SHELF = 'shelf',
  CLEAR_CACHE = 'clear-cache',
}

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: SettingsPath.SETTINGS, redirectTo: SettingsPath.KEYBOARD_MAPPINGS, pathMatch: 'full' },
      { path: SettingsPath.KEYBOARD_MAPPINGS, loadChildren: () => import('./keyboard-mapping-settings/keyboard-mapping-settings.module').then(module => module.KeyboardMappingSettingsModule) },
      { path: SettingsPath.SHELF, loadChildren: () => import('./shelf-settings/shelf-settings.module').then(module => module.ShelfSettingsModule) },
      { path: SettingsPath.CLEAR_CACHE, component: ClearCacheComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
