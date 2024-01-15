import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './components/settings/settings.component'
import { SettingsMenuComponent } from './components/settings/settings-menu/settings-menu.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'
import { ClearCacheComponent } from './components/clear-cache/clear-cache.component'
import { HttpConfigurationCacheService } from './services/http/http-configuration-cache.service'
import { ConfigurationCacheService } from './services/configuration-cache.service'

@NgModule({
  declarations: [SettingsComponent, SettingsMenuComponent, ClearCacheComponent],
  imports: [SettingsRoutingModule, SharedModule, MatSidenavModule, MatToolbarModule, MatListModule],
  providers: [{ provide: ConfigurationCacheService, useValue: HttpConfigurationCacheService }],
})
export class SettingsModule {}
