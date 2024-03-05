import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SettingsPageComponent } from './components/settings-page/settings-page.component'

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [CommonModule],
  exports: [SettingsPageComponent],
})
export class SettingsSharedModule {}
