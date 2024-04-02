import { Component, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { Notification } from '../../models/notification'
import { animate, state, style, transition, trigger } from '@angular/animations'

const NOTIFICATION_DURATION_MS: number = 7000
const NOTIFICATION_STARTUP_REGISTRATION_DURATION_IN_MS: number = 200

@Component({
  selector: 'sofie-notification-popup-container',
  templateUrl: './notification-popup-container.component.html',
  styleUrls: ['./notification-popup-container.component.scss'],
  animations: [
    trigger('notification', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [style({ transform: 'translateX(100%)', height: '0', paddingTop: '0', paddingBottom: '0' }), animate('200ms ease-in-out')]),
      transition(':leave', [style({ opacity: 0 }), animate('200ms ease-in-out', style({ height: '0', paddingTop: '0', paddingBottom: '0' }))]),
    ]),
  ],
})
export class NotificationPopupContainerComponent implements OnInit, OnDestroy {
  protected notificationContexts: { notification: Notification; expirationEpochTime: number }[] = []
  private expirationTimer?: NodeJS.Timeout
  private readonly destroySubject: Subject<void> = new Subject()

  constructor(private readonly notificationService: NotificationService) {}

  protected removeNotification = (notificationToRemove: Notification): void => {
    this.notificationContexts = this.notificationContexts.filter(notificationContext => notificationContext.notification.id !== notificationToRemove.id)
  }

  public ngOnInit(): void {
    const initEpochTime: number = Date.now()
    this.notificationService
      .subscribeToNewNotifications()
      .pipe(takeUntil(this.destroySubject))
      .subscribe((notification: Notification) => {
        if (Date.now() <= initEpochTime + NOTIFICATION_STARTUP_REGISTRATION_DURATION_IN_MS) {
          return
        }
        this.registerNotification(notification)
      })
  }

  private registerNotification(notification: Notification): void {
    this.removeNotification(notification)
    this.notificationContexts = [{ notification, expirationEpochTime: Date.now() + NOTIFICATION_DURATION_MS }, ...this.notificationContexts]
    if (!this.expirationTimer) {
      this.scheduleNotificationExpirationCheck()
    }
  }

  private scheduleNotificationExpirationCheck(): void {
    this.clearExpirationTimer()
    if (this.notificationContexts.length === 0) {
      return
    }
    this.checkNotificationExpiration()
    this.expirationTimer = setTimeout(() => this.scheduleNotificationExpirationCheck(), 200)
  }

  private checkNotificationExpiration(): void {
    this.notificationContexts = this.notificationContexts.filter(notificationContext => notificationContext.expirationEpochTime > Date.now())
  }

  private clearExpirationTimer(): void {
    clearTimeout(this.expirationTimer)
    this.expirationTimer = undefined
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }
}
