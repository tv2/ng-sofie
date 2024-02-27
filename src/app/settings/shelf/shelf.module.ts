import { EditActionPanelComponent } from './action-panel/edit-action-panel/edit-action-panel.component'
import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { RouterModule, Routes } from '@angular/router'
import { ActionPanelListComponent } from './action-panel/action-panel-list/action-panel-list.component'
import { ActionPanelImportComponent } from './action-panel/action-panel-import/action-panel-import.component'
import { ActionPanelComponent } from './action-panel/action-panel.component'

export enum ShelfPaths {
  ACTION_PANELS = 'action-panels',
}

const routes: Routes = [
  { path: '', redirectTo: ShelfPaths.ACTION_PANELS, pathMatch: 'full' },
  { path: ShelfPaths.ACTION_PANELS, component: ActionPanelComponent },
]

@NgModule({
  declarations: [ActionPanelComponent, ActionPanelListComponent, EditActionPanelComponent, ActionPanelImportComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class ShelfModule {}
