import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RundownOverviewComponent} from './components/rundown-overview/rundown-overview.component';
import {RundownOverviewRoutingModule} from './rundown-overview-routing.module';
import {MatTableModule} from "@angular/material/table";
import { PulsatingDotComponent } from './components/pulsating-dot/pulsating-dot.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    RundownOverviewComponent,
    PulsatingDotComponent,
  ],
    imports: [
        RundownOverviewRoutingModule,
        SharedModule,
        MatTableModule,
        MatCardModule
    ]
})
export class RundownOverviewModule { }
