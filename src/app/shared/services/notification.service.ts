import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { Notification } from '../models/notification'
import { StatusCode } from '../enums/status-code'
import { StatusMessage } from '../models/status-message'
import { StatusMessageEventObserver } from '../../core/services/status-message-event-observer'
import { v4 as generateUuid } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly newNotificationSubject: Subject<Notification> = new Subject()

  private isNotificationPanelOpen: boolean = false
  private readonly notificationPanelIsOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.isNotificationPanelOpen)

  constructor(statusMessageEventObserver: StatusMessageEventObserver) {
    statusMessageEventObserver.subscribeToStatusMessageEvents(statusMessageEvent => this.createNotificationFromStatusMessage(statusMessageEvent.statusMessage))
  }

  public createNotificationFromStatusMessage(statusMessage: StatusMessage): void {
    const message: string = `${statusMessage.title}: ${statusMessage.message}` + (statusMessage.statusCode === StatusCode.GOOD ? ` Okay` : '')
    const notification: Notification = {
      id: statusMessage.id,
      message,
      statusCode: statusMessage.statusCode,
      isPersistent: statusMessage.statusCode !== StatusCode.GOOD,
    }
    this.newNotificationSubject.next(notification)
  }

  public createInfoNotification(message: string): void {
    const notification: Notification = this.createNotification(message, StatusCode.GOOD)
    this.newNotificationSubject.next(notification)
  }

  private createNotification(message: string, statusCode: StatusCode): Notification {
    return {
      id: generateUuid(),
      message,
      statusCode,
    }
  }

  public createErrorNotification(message: string): void {
    const notification: Notification = this.createNotification(message, StatusCode.BAD)
    this.newNotificationSubject.next(notification)
  }

  public createWarningNotification(message: string): void {
    const notification: Notification = this.createNotification(message, StatusCode.WARNING)
    this.newNotificationSubject.next(notification)
  }

  public subscribeToNewNotifications(): Observable<Notification> {
    return this.newNotificationSubject.asObservable()
  }

  public toggleNotificationPanel(): void {
    this.isNotificationPanelOpen = !this.isNotificationPanelOpen
    this.notificationPanelIsOpenSubject.next(this.isNotificationPanelOpen)
  }

  public subscribeToNotificationPanelIsOpen(): Observable<boolean> {
    return this.notificationPanelIsOpenSubject.asObservable()
  }
}
