import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnsureLoadedOnceGuard} from './ensure-loaded-once.guard';
import {HttpErrorService} from './services/http-error.service';
import {RundownEventService} from './services/rundown-event.service';
import {MockRundownEventService} from './mocks/mock.rundown-event.service';
import {RundownEventServiceInterface} from './interfaces/rundown-event-service-interface';
import {HttpClientModule} from '@angular/common/http';
import {RundownPlaylistService} from './services/rundown-playlist.service';
import {MockRundownPlaylistService} from './mocks/mock.rundown-playlist.service';
import {RundownService} from './services/rundown.service';
import {MockRundownService} from './mocks/mock.rundown.service';
import {AdLibPieceService} from './services/ad-lib-piece.service';
import {MockAdLibPieceService} from './mocks/mock.ad-lib-piece.service';
import {MockDataService} from './mocks/mock.data.service';

const rundownEventService: RundownEventServiceInterface = new MockRundownEventService()

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    HttpErrorService,
    HttpClientModule,
    { provide: RundownEventService, useValue: rundownEventService },
    { provide: MockRundownEventService, useValue: rundownEventService },
    { provide: RundownPlaylistService, useClass: MockRundownPlaylistService },
    { provide: RundownService, useClass: MockRundownService },
    { provide: AdLibPieceService, useClass: MockAdLibPieceService },
    MockDataService
  ]
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
