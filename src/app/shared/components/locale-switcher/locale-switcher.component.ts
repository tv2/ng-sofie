    import {Component, Inject, LOCALE_ID} from '@angular/core';

    @Component({
      selector: 'sofie-locale-switcher',
      templateUrl: './locale-switcher.component.html',
      styleUrls: ['./locale-switcher.component.scss']
    })
    export class LocaleSwitcherComponent {

        public selectedLocal: string
      locales = [
        { code: "en-US", name: 'EN'},
        { code: "da", name: 'DK'},
      ];

      constructor(
          @Inject(LOCALE_ID) public activeLocale: string

      ) {}

        onChange() {
            window.location.href = `/${this.activeLocale}`;
        }
    }
