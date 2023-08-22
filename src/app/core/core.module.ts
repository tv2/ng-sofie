import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { HttpErrorService } from './services/http-error.service'
import { RundownEventService } from './services/rundown-event.service'
import { HttpClientModule } from '@angular/common/http'
import { RundownPlaylistService } from './services/rundown-playlist.service'
import { RundownService } from './services/rundown.service'
import { AdLibPieceService } from './services/ad-lib-piece.service'
import { RundownStateService } from './services/rundown-state.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    HttpErrorService,
    HttpClientModule,
    RundownEventService,
    RundownPlaylistService,
    RundownService,
    AdLibPieceService,
    RundownStateService,
  ]
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
