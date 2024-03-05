import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { RouterModule, Routes } from '@angular/router'
import { ActionPanelComponent } from './components/action-panel/action-panel.component'
import { EditActionPanelComponent } from './components/edit-action-panel/edit-action-panel.component'
import { ActionPanelListComponent } from './components/action-panel-list/action-panel-list.component'
import { ActionPanelImportComponent } from './components/action-panel-import/action-panel-import.component'

export enum ShelfSettingsPath {
  ACTION_PANELS = 'ACTION_PANELS',
}

const routes: Routes = [
  { path: '', redirectTo: ShelfSettingsPath.ACTION_PANELS, pathMatch: 'full' },
  { path: ShelfSettingsPath.ACTION_PANELS, component: ActionPanelComponent },
]

@NgModule({
  declarations: [ActionPanelComponent, ActionPanelListComponent, EditActionPanelComponent, ActionPanelImportComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class ShelfSettingsModule {}
