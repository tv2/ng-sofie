import { Component, ElementRef, OnInit } from '@angular/core'
import { Paths } from '../../../app-routing.module'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'sofie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public title: string
  public elementRef: ElementRef

  public readonly Paths = Paths

  constructor(
    elementRef: ElementRef,
    private readonly titleService: Title
  ) {
    this.elementRef = elementRef
  }

  public ngOnInit(): void {
    this.title = this.titleService.getTitle()
  }
}
