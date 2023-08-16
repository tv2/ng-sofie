import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RundownOverviewComponent} from './components/rundown-playlists/rundown-overview.component';
import {RundownOverviewRoutingModule} from './rundown-overview-routing.module';
import {MatTableModule} from "@angular/material/table";
import { StatusSignalComponent } from './components/active-signal/status-signal.component';


@NgModule({
  declarations: [
    RundownOverviewComponent,
    StatusSignalComponent
  ],
  imports: [
    RundownOverviewRoutingModule,
    SharedModule,
    MatTableModule
  ]
})
export class RundownOverviewModule { }
