import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StatusOverviewComponent } from './components/status-overview/status-overview.component'
import { StatusOverviewRoutesModule } from './status-overview-routes.module'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [StatusOverviewComponent],
  imports: [CommonModule, StatusOverviewRoutesModule, SharedModule],
})
export class StatusOverviewModule {}
