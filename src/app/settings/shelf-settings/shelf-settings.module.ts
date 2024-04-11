import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { RouterModule, Routes } from '@angular/router'
import { ShelfActionPanelSettingsPageComponent } from './components/shelf-action-panel-settings-page/shelf-action-panel-settings-page.component'
import { EditShelfActionPanelConfigurationComponent } from './components/edit-shelf-action-panel-configuration/edit-shelf-action-panel-configuration.component'
import { EditShelfActionPanelConfigurationDialogComponent } from './components/edit-shelf-action-panel-confinguration-dialog/edit-shelf-action-panel-configuration-dialog.component'
import { ProducerShelfModule } from '../../producer-shelf/producer-shelf.module'
import { StaticButtonsConfigurationCardComponent } from './components/static-buttons-configuration-card/static-buttons-configuration-card.component'
import { KeyboardMappingSettingsModule } from '../keyboard-mapping-settings/keyboard-mapping-settings.module'
import { EditStaticButtonsDialogComponent } from './components/edit-static-buttons-dialog/edit-static-buttons-dialog.component'
import { EditStaticButtonsComponent } from './components/edit-static-buttons/edit-static-buttons.component'

export enum ShelfSettingsPath {
  ACTION_PANELS = 'action-panels',
}

const routes: Routes = [
  { path: '', redirectTo: ShelfSettingsPath.ACTION_PANELS, pathMatch: 'full' },
  { path: ShelfSettingsPath.ACTION_PANELS, component: ShelfActionPanelSettingsPageComponent },
]

@NgModule({
  declarations: [
    ShelfActionPanelSettingsPageComponent,
    EditShelfActionPanelConfigurationDialogComponent,
    EditShelfActionPanelConfigurationComponent,
    StaticButtonsConfigurationCardComponent,
    EditStaticButtonsDialogComponent,
    EditStaticButtonsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes), ProducerShelfModule, KeyboardMappingSettingsModule],
  providers: [],
})
export class ShelfSettingsModule {}
