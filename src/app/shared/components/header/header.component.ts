import { Component } from '@angular/core'
import {Paths} from '../../../app-routing.module'
import {Router} from '@angular/router'

@Component({
  selector: 'sofie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public title = 'Sofie'

  constructor(private readonly router: Router) {}

  public navigateHome(): void {
    const routeSegments: string[] = [Paths.HOME]
    this.router.navigate(routeSegments)
      .catch(() => console.warn('[warn] Failed navigating with route segments:', routeSegments))
  }

  public navigateToRundown(): void {
    const routeSegments: string[] = [Paths.RUNDOWNS]
    this.router.navigate(routeSegments)
      .catch(() => console.warn('[warn] Failed navigating with route segments:', routeSegments))
  }
}
