import { Component, OnDestroy, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { SettingsPath } from 'src/app/settings/settings-routing.module'
import { ShelfSettingsPath } from '../../shelf-settings/shelf-settings.module'

interface MenuItem {
  name: string
  routerLink: string[]
  shouldShowSubItems?: () => boolean
  subItems?: MenuItem[]
}

@Component({
  selector: 'sofie-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit, OnDestroy {
  public menuItems: MenuItem[] = [
    {
      name: $localize`settings.keyboard-mappings.title`,
      routerLink: [SettingsPath.KEYBOARD_MAPPINGS],
    },
    {
      name: $localize`settings.shelf.label`,
      routerLink: [SettingsPath.SHELF],
      shouldShowSubItems: (): boolean => this.isShelfRouteActive,
      subItems: [
        {
          name: $localize`settings.shelf.action-panels.title`,
          routerLink: [SettingsPath.SHELF, ShelfSettingsPath.ACTION_PANELS],
        },
      ],
    },
    {
      name: $localize`settings.clear-cache.label`,
      routerLink: [SettingsPath.CLEAR_CACHE],
    },
  ]

  private isShelfRouteActive: boolean = false

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.isShelfRouteActive = this.router.url.includes(SettingsPath.SHELF)
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(routerEvent => {
      if (routerEvent instanceof NavigationEnd) {
        this.isShelfRouteActive = routerEvent.url.includes(SettingsPath.SHELF)
      }
    })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
