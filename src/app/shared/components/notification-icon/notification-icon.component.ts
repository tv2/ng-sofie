import { Component, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { Notification } from '../../models/notification'

@Component({
  selector: 'sofie-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss'],
})
export class NotificationIconComponent implements OnInit, OnDestroy {
  public isNotificationPanelOpen: boolean

  private readonly notifications: Notification[] = []

  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize

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
      .subscribe(notification => this.addNotification(notification))
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

  public toggleNotificationPanel(): void {
    this.notificationService.toggleNotificationPanel()
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }

  get hasNotification(): boolean {
    return this.notifications.length > 0
  }
}
