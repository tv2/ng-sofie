import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { ActionTriggersComponent } from './components/action-triggers/action-triggers.component'
import { RouterModule, Routes } from '@angular/router'
import { ActionTriggersListComponent } from './components/action-triggers-list/action-triggers-list.component'
import { EditActionTriggersComponent } from './components/edit-action-triggers/edit-action-triggers.component'
import { HttpActionService } from 'src/app/shared/services/http/http-action.service'
import { ActionService } from 'src/app/shared/abstractions/action.service'
import { SelectActionTriggerComponent } from './components/edit-action-triggers/select-action-trigger/select-action-trigger.component'
import { SingleActionTriggerBoxComponent } from './components/edit-action-triggers/select-action-trigger/single-action-trigger-box/single-action-trigger-box.component'
import { ActionTriggersImportComponent } from './components/action-triggers-import/action-triggers-import.component'
import { HttpActionTriggerService } from 'src/app/shared/services/http/http-action-trigger.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'

const routes: Routes = [{ path: '', component: ActionTriggersComponent }]

@NgModule({
  declarations: [ActionTriggersComponent, ActionTriggersListComponent, EditActionTriggersComponent, SelectActionTriggerComponent, SingleActionTriggerBoxComponent, ActionTriggersImportComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [
    { provide: ActionTriggerService, useClass: HttpActionTriggerService },
    { provide: ActionService, useClass: HttpActionService },
  ],
})
export class ActionTriggersModule {}
