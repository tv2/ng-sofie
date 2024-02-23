import { Component, ElementRef, OnInit } from '@angular/core'
import { Paths } from '../../../app-routing.module'
import { Router } from '@angular/router'
import { Logger } from '../../../core/abstractions/logger.service'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'sofie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public title: string
  public elementRef: ElementRef

  private readonly logger: Logger

  constructor(
    private readonly elementReference: ElementRef,
    private readonly router: Router,
    private readonly titleService: Title,
    logger: Logger
  ) {
    this.logger = logger.tag('HeaderComponent')
    this.elementRef = elementReference
  }

  public ngOnInit(): void {
    this.title = this.titleService.getTitle()
  }

  public navigateHome(): void {
    const segmentedPath: string[] = [Paths.HOME]
    this.router.navigate(segmentedPath).catch(error => this.logger.data(error).warn(`Failed navigating to /${segmentedPath.join('/')}.`))
  }

  public navigateToRundown(): void {
    const segmentedPath: string[] = [Paths.RUNDOWNS]
    this.router.navigate(segmentedPath).catch(error => this.logger.data(error).warn(`Failed navigating to /${segmentedPath.join('/')}.`))
  }

  public navigateToStatus(): void {
    const segmentedPath: string[] = [Paths.STATUS]
    this.router.navigate(segmentedPath).catch(error => this.logger.data(error).warn(`Failed navigating to /${segmentedPath.join('/')}.`))
  }

  public navigateToSettings(): void {
    const segmentedPath: string[] = [Paths.SETTINGS]
    this.router.navigate(segmentedPath).catch(error => this.logger.data(error).warn(`Failed navigating to /${segmentedPath.join('/')}.`))
  }
}
