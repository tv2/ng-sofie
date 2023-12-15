import { NgModule } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { SharedModule } from 'src/app/shared/shared.module'
import { ActionTriggersComponent } from './components/action-triggers/action-triggers.component'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [{ path: '', component: ActionTriggersComponent }]

@NgModule({
  declarations: [ActionTriggersComponent],
  imports: [SharedModule, MatListModule, RouterModule.forChild(routes)],
})
export class ActionTriggersModule {}
