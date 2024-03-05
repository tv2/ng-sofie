import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  @Input()
  public title: string

  constructor() {}
}
