import { Component, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { Icon, IconSize } from '../../enums/icon'
import { Notification } from '../../models/notification'
import { StatusCode } from '../../enums/status-code'

@Component({
  selector: 'sofie-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss'],
})
export class NotificationIconComponent implements OnInit, OnDestroy {
  public isNotificationPanelOpen: boolean

  protected readonly notifications: Notification[] = []

  public readonly Icon = Icon
  public readonly IconSize = IconSize
  protected highestStatusCode: StatusCode = StatusCode.UNKNOWN

  private readonly destroySubject: Subject<void> = new Subject()

  constructor(private readonly notificationService: NotificationService) {}

  public ngOnInit(): void {
    this.notificationService
      .subscribeToNotificationPanelIsOpen()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(isNotificationPanelOpen => (this.isNotificationPanelOpen = isNotificationPanelOpen))

    this.notificationService
      .subscribeToNewNotifications()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(notification => {
        this.addNotification(notification)
        this.highestStatusCode = this.getHighestStatusCode()
      })
  }

  private addNotification(notification: Notification): void {
    const index: number = this.notifications.findIndex(n => n.id === notification.id)
    if (index > -1) {
      this.notifications.splice(index, 1)
    }

    if (!notification.isPersistent) {
      return
    }
    this.notifications.push(notification)
  }

  protected getHighestStatusCode(): StatusCode {
    return this.notifications.reduce((highestStatusCode: StatusCode, notification: Notification) => {
      if (this.getStatusCodePriority(notification.statusCode) == this.getStatusCodePriority(highestStatusCode)) {
        return highestStatusCode
      }
      return notification.statusCode
    }, StatusCode.UNKNOWN)
  }

  protected getStatusCodePriority(statusCode: StatusCode): number {
    switch (statusCode) {
      case StatusCode.BAD:
        return 3
      case StatusCode.WARNING:
        return 2
      case StatusCode.GOOD:
        return 1
      case StatusCode.UNKNOWN:
        return 0
    }
  }

  public toggleNotificationPanel(): void {
    this.notificationService.toggleNotificationPanel()
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }

  public hasNotification(): boolean {
    return this.notifications.length > 0
  }
}
