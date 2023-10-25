import { Component, Inject, LOCALE_ID } from '@angular/core'

@Component({
  selector: 'sofie-locale-switcher',
  templateUrl: './locale-switcher.component.html',
  styleUrls: ['./locale-switcher.component.scss'],
})
export class LocaleSwitcherComponent {
  public locales = [
    { code: 'en-US', name: 'EN' },
    { code: 'da', name: 'DK' },
  ]

  constructor(@Inject(LOCALE_ID) public activeLocale: string) {}

  public onChange(): void {
    window.location.href = `/${this.activeLocale}`
  }
}
