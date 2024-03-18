import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  @Input()
  public title: string

  constructor() {}
}
