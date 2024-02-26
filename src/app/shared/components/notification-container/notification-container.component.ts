import { AfterViewInit, ApplicationRef, Component, ComponentRef, createComponent, ElementRef, EmbeddedViewRef, Input, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { NotificationComponent } from '../notification/notification.component'
import { Notification } from '../../models/notification'
import { StatusMessageEventObserver } from '../../../core/services/status-message-event-observer'
import { EventSubscription } from '../../../event-system/abstractions/event-observer.service'
import { StatusMessage } from '../../models/status-message'
import { StatusCode } from '../../enums/status-code'
import { SystemInformationService } from '../../services/system-information.service'

const NOTIFICATION_DURATION_MS: number = 7000
const TOP_PADDING: number = 5
const PIXEL_POSTFIX: string = 'px'

const STACK_GAP: number = 5

const NON_PERSISTENT_NOTIFICATION_ID: string = 'NON_PERSISTENT_NOTIFICATION_ID'

@Component({
  selector: 'sofie-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
})
export class NotificationContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public topOffset: number = 0

  @Input()
  public rightOffset: number = 0

  private readonly destroySubject: Subject<void> = new Subject()

  private readonly notificationElements: HTMLElement[] = []

  private statusMessageEventSubscription: EventSubscription

  constructor(
    private readonly elementRef: ElementRef,
    private readonly applicationRef: ApplicationRef,
    private readonly notificationService: NotificationService,
    private readonly statusMessageEventObserver: StatusMessageEventObserver,
    private readonly systemInformationService: SystemInformationService
  ) {}

  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.style.top = TOP_PADDING + this.topOffset + PIXEL_POSTFIX
    this.elementRef.nativeElement.style.right = this.rightOffset + PIXEL_POSTFIX
  }

  public ngOnInit(): void {
    this.notificationService
      .subscribeToNotifications()
      .pipe(takeUntil(this.destroySubject))
      .subscribe((notification: Notification) => this.createNotification(notification))

    this.statusMessageEventSubscription = this.statusMessageEventObserver.subscribeToStatusMessageEvents(statusMessageEvent =>
      this.createNotificationFromStatusMessage(statusMessageEvent.statusMessage)
    )

    this.systemInformationService.getStatusMessages().subscribe(statusMessages => this.createNotificationsFromStatusMessages(statusMessages))
  }

  private createNotification(notification: Notification, elementId?: string): void {
    const notificationElement: HTMLElement = this.createNotificationElement(notification, elementId)
    this.insertNotificationIntoContainer(notificationElement)
    if (!notification.isPersistent) {
      this.setRemoveNotificationTimer(notificationElement)
    }
    this.moveNotifications()
  }

  private createNotificationElement(notification: Notification, elementId?: string): HTMLElement {
    const notificationComponentRef: ComponentRef<NotificationComponent> = createComponent(NotificationComponent, {
      environmentInjector: this.applicationRef.injector,
    })

    notificationComponentRef.instance.notification = notification
    notificationComponentRef.instance.onRemoveCallback = (notificationElement: HTMLElement): void => this.removeNotificationElement(notificationElement)
    notificationComponentRef.changeDetectorRef.detectChanges()

    const notificationElement: HTMLElement = (<EmbeddedViewRef<NotificationComponent>>notificationComponentRef.hostView).rootNodes[0]
    notificationElement.id = elementId ?? NON_PERSISTENT_NOTIFICATION_ID
    return notificationElement
  }

  private insertNotificationIntoContainer(notificationElement: HTMLElement): void {
    const host: HTMLElement = this.elementRef.nativeElement
    host.insertAdjacentElement('afterbegin', notificationElement)
    this.notificationElements.unshift(notificationElement)
  }

  private setRemoveNotificationTimer(notificationElement: HTMLElement): void {
    setTimeout(() => this.removeNotificationElement(notificationElement), NOTIFICATION_DURATION_MS)
  }

  private removeNotificationElement(notificationElement: HTMLElement): void {
    notificationElement.remove()
    const index: number = this.notificationElements.indexOf(notificationElement)
    if (index === -1) {
      return
    }
    this.notificationElements.splice(index, 1)

    this.moveNotifications()
  }

  private moveNotifications(): void {
    if (this.notificationElements.length === 0) {
      return
    }
    this.notificationElements[0].style.top = 0 + PIXEL_POSTFIX
    let top: number = this.notificationElements[0].offsetHeight + STACK_GAP
    for (let i = 1; i < this.notificationElements.length; i++) {
      const notificationElement: HTMLElement = this.notificationElements[i]
      notificationElement.style.top = top + PIXEL_POSTFIX
      top += notificationElement.offsetHeight + STACK_GAP
    }
  }

  private createNotificationsFromStatusMessages(statuesMessages: StatusMessage[]): void {
    statuesMessages.forEach(this.createNotificationFromStatusMessage.bind(this))
  }

  private createNotificationFromStatusMessage(statusMessage: StatusMessage): void {
    const message: string = `${statusMessage.title}: ${statusMessage.message}` + (statusMessage.statusCode === StatusCode.GOOD ? ` Okay` : '')
    const notification: Notification = {
      message,
      statusCode: statusMessage.statusCode,
      isPersistent: statusMessage.statusCode !== StatusCode.GOOD,
    }

    const existingNotificationElement: HTMLElement | undefined = this.notificationElements.find(element => element.id === statusMessage.id)
    if (existingNotificationElement) {
      this.removeNotificationElement(existingNotificationElement)
    }

    this.createNotification(notification, statusMessage.id)
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()

    this.statusMessageEventSubscription.unsubscribe()
  }
}
