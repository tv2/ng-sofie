import { Component } from '@angular/core'
import { SettingsPaths } from 'src/app/settings/settings-routing.module'

@Component({
  selector: 'sofie-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent {
  public settingsPaths = SettingsPaths
}
