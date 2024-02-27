import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { SystemInformationService } from '../../services/system-information.service'
import { Notification } from '../../models/notification'
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
  selector: 'sofie-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
  animations: [
    trigger('showPanel', [
      state(
        'true',
        style({
          width: '400px',
        })
      ),
      state(
        'false',
        style({
          width: '0px',
        })
      ),
      transition('true <=> false', animate('300ms ease-in-out')),
    ]),
  ],
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
  public showPanel: boolean = false
  public notifications: Notification[] = []

  private readonly timeoutMap: Map<string, NodeJS.Timeout> = new Map()
  private readonly destroySubject: Subject<void> = new Subject()

  constructor(
    private readonly notificationStateService: NotificationService,
    private readonly systemInformationService: SystemInformationService
  ) {}

  @HostBinding('@showPanel') get showPanelAnimation(): boolean {
    return this.showPanel
  }

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
    const timeout: NodeJS.Timeout = setTimeout(() => this.removeNotification(notification), 5000)
    this.timeoutMap.set(notification.id, timeout)
  }

  public removeNotification(notification: Notification): void {
    const index: number = this.notifications.findIndex(n => n.id === notification.id)
    if (index === -1) {
      return
    }
    this.notifications.splice(index, 1)
    this.stopTimeout(notification)
  }

  private stopTimeout(notification: Notification): void {
    if (!this.timeoutMap.has(notification.id)) {
      return
    }
    const timeout: NodeJS.Timeout = this.timeoutMap.get(notification.id)!
    clearTimeout(timeout)
    this.timeoutMap.delete(notification.id)
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }
}
