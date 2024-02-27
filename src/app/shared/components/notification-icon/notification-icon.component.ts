import { Component, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

@Component({
  selector: 'sofie-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss'],
})
export class NotificationIconComponent implements OnInit, OnDestroy {
  public isNotificationPanelOpen: boolean

  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize

  private readonly destroySubject: Subject<void> = new Subject()

  constructor(private readonly notificationService: NotificationService) {}

  public ngOnInit(): void {
    this.notificationService
      .subscribeToNotificationPanelIsOpen()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(isNotificationPanelOpen => (this.isNotificationPanelOpen = isNotificationPanelOpen))
  }

  public toggleNotificationPanel(): void {
    this.notificationService.toggleNotificationPanel()
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }
}
