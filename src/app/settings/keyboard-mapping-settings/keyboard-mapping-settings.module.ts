import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { RouterModule, Routes } from '@angular/router'
import { ActionTriggersListComponent } from './components/action-triggers-list/action-triggers-list.component'
import { EditActionTriggersComponent } from './components/edit-action-triggers/edit-action-triggers.component'
import { SelectActionTriggerComponent } from './components/select-action-trigger/select-action-trigger.component'
import { SingleActionTriggerBoxComponent } from './components/select-action-trigger/single-action-trigger-box/single-action-trigger-box.component'
import { ActionTriggersImportComponent } from './components/action-triggers-import/action-triggers-import.component'
import { KeyboardKeysFieldComponent } from './components/keyboard-keys-field/keyboard-keys-field.component'
import { SettingsSharedModule } from '../settings-shared/settings-shared.module'
import { KeyboardMappingSettingsPageComponent } from './components/keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'

const routes: Routes = [{ path: '', component: KeyboardMappingSettingsPageComponent }]

@NgModule({
  declarations: [
    KeyboardMappingSettingsPageComponent,
    ActionTriggersListComponent,
    EditActionTriggersComponent,
    SelectActionTriggerComponent,
    SingleActionTriggerBoxComponent,
    ActionTriggersImportComponent,
    KeyboardKeysFieldComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes), SettingsSharedModule],
  providers: [],
})
export class KeyboardMappingSettingsModule {}
