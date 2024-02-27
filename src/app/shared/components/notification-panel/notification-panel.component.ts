import { Component, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { SystemInformationService } from '../../services/system-information.service'
import { Notification } from '../../models/notification'

@Component({
  selector: 'sofie-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
  public showPanel: boolean = false
  public notifications: Notification[] = []

  private readonly destroySubject: Subject<void> = new Subject()

  constructor(
    private readonly notificationStateService: NotificationService,
    private readonly systemInformationService: SystemInformationService
  ) {}

  public ngOnInit(): void {
    this.notificationStateService
      .subscribeToNotificationPanelIsOpen()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(isNotificationPanelOpen => {
        this.showPanel = isNotificationPanelOpen
      })

    this.notificationStateService
      .subscribeToNewNotifications()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(notification => {
        this.removeNotification(notification)
        this.notifications.unshift(notification)
        this.setRemoveNotificationTimer(notification)
      })

    this.systemInformationService.getStatusMessages().subscribe(statusMessages => statusMessages.map(statusMessage => this.notificationStateService.createNotificationFromStatusMessage(statusMessage)))
  }

  private setRemoveNotificationTimer(notification: Notification): void {
    if (notification.isPersistent) {
      return
    }
    setTimeout(() => this.removeNotification(notification), 5000)
  }

  public removeNotification(notification: Notification): void {
    const index: number = this.notifications.findIndex(n => n.id === notification.id)
    if (index === -1) {
      return
    }
    this.notifications.splice(index, 1)
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }
}
