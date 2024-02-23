import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable()
export class NotificationService {
  private readonly notificationSubject: Subject<void> = new Subject()

  public createNotification(): void {
    this.notificationSubject.next()
  }

  public subscribeToNotifications(): Observable<void> {
    return this.notificationSubject.asObservable()
  }
}
