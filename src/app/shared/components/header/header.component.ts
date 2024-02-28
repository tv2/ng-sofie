import { Component, OnInit } from '@angular/core'
import { Paths } from '../../../app-routing.module'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'sofie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public title: string
  public readonly Paths = Paths

  constructor(private readonly titleService: Title) {}

  public ngOnInit(): void {
    this.title = this.titleService.getTitle()
  }
}
