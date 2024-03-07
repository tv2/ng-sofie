import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { RouterModule, Routes } from '@angular/router'
import { SettingsSharedModule } from '../settings-shared/settings-shared.module'
import { ShelfActionPanelSettingsPageComponent } from './components/shelf-action-panel-settings-page/shelf-action-panel-settings-page.component'
import { EditShelfActionPanelConfigurationDialogComponent } from './components/edit-shelf-action-panel-confinguration/edit-shelf-action-panel-configuration-dialog.component'

export enum ShelfSettingsPath {
  ACTION_PANELS = 'ACTION_PANELS',
}

const routes: Routes = [
  { path: '', redirectTo: ShelfSettingsPath.ACTION_PANELS, pathMatch: 'full' },
  { path: ShelfSettingsPath.ACTION_PANELS, component: ShelfActionPanelSettingsPageComponent },
]

@NgModule({
  declarations: [ShelfActionPanelSettingsPageComponent, EditShelfActionPanelConfigurationDialogComponent],
  imports: [SharedModule, RouterModule.forChild(routes), SettingsSharedModule],
  providers: [],
})
export class ShelfSettingsModule {}
