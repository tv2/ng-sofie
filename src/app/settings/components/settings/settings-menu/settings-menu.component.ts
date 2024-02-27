import { Component, OnDestroy, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { SettingsPaths } from 'src/app/settings/settings-routing.module'
import { ShelfPaths } from 'src/app/settings/shelf/shelf.module'

@Component({
  selector: 'sofie-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit, OnDestroy {
  public settingsPaths = SettingsPaths
  public shelfPaths = ShelfPaths
  public isShelfRouteActive: boolean = false

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.isShelfRouteActive = this.router.url.includes(this.settingsPaths.SHELF)
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(routerEvent => {
      if (routerEvent instanceof NavigationEnd) {
        this.isShelfRouteActive = routerEvent.url.includes(this.settingsPaths.SHELF)
      }
    })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
