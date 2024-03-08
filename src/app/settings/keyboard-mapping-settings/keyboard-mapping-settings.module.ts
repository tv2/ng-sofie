import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { RouterModule, Routes } from '@angular/router'
import { SettingsSharedModule } from '../settings-shared/settings-shared.module'
import { KeyboardMappingSettingsPageComponent } from './components/keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'
import { ProducerShelfModule } from '../../producer-shelf/producer-shelf.module'
import { EditKeyboardMappingDialogComponent } from './components/edit-keyboard-mapping-dialog/edit-keyboard-mapping-dialog.component'
import { ActionSelectorComponent } from './components/action-selector/action-selector.component'

const routes: Routes = [{ path: '', component: KeyboardMappingSettingsPageComponent }]

@NgModule({
  declarations: [KeyboardMappingSettingsPageComponent, EditKeyboardMappingDialogComponent, ActionSelectorComponent],
  imports: [SharedModule, RouterModule.forChild(routes), SettingsSharedModule, ProducerShelfModule],
  providers: [],
})
export class KeyboardMappingSettingsModule {}
