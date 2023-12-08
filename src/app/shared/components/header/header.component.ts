import { Component } from '@angular/core'
import { Paths } from '../../../app-routing.module'
import { Router } from '@angular/router'
import { Logger } from '../../../core/abstractions/logger.service'

@Component({
  selector: 'sofie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public title = 'Sofie'
  private readonly logger: Logger

  constructor(
    private readonly router: Router,
    logger: Logger
  ) {
    this.logger = logger.tag('HeaderComponent')
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
}
