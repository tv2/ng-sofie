import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { Notification } from '../models/notification'
import { StatusCode } from '../enums/status-code'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationSubject: Subject<Notification> = new Subject()

  public createInfoNotification(message: string): void {
    this.notificationSubject.next({ message, statusCode: StatusCode.GOOD })
  }

  public createErrorNotification(message: string): void {
    this.notificationSubject.next({ message, statusCode: StatusCode.BAD })
  }

  public createWarningNotification(message: string): void {
    this.notificationSubject.next({ message, statusCode: StatusCode.WARNING })
  }

  public subscribeToNotifications(): Observable<Notification> {
    return this.notificationSubject.asObservable()
  }
}
