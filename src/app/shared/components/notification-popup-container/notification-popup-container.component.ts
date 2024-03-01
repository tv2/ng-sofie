import { AfterViewInit, ApplicationRef, Component, ComponentRef, createComponent, ElementRef, EmbeddedViewRef, Input, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { Notification } from '../../models/notification'
import { NotificationPopupComponent } from '../notification-popup-component/notification-popup.component'

const NOTIFICATION_DURATION_MS: number = 7000
const TOP_PADDING: number = 5
const PIXEL_POSTFIX: string = 'px'

const STACK_GAP: number = 5

@Component({
  selector: 'sofie-notification-popup-container',
  templateUrl: './notification-popup-container.component.html',
  styleUrls: ['./notification-popup-container.component.scss'],
})
export class NotificationPopupContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public topOffset: number = 0

  @Input()
  public rightOffset: number = 0

  private readonly notificationElements: HTMLElement[] = []
  private readonly timeoutMap: Map<string, NodeJS.Timeout> = new Map()

  private readonly destroySubject: Subject<void> = new Subject()

  constructor(
    private readonly elementRef: ElementRef,
    private readonly applicationRef: ApplicationRef,
    private readonly notificationService: NotificationService
  ) {}

  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.style.top = TOP_PADDING + this.topOffset + PIXEL_POSTFIX
    this.elementRef.nativeElement.style.right = this.rightOffset + PIXEL_POSTFIX
  }

  public ngOnInit(): void {
    this.notificationService
      .subscribeToNewNotifications()
      .pipe(takeUntil(this.destroySubject))
      .subscribe((notification: Notification) => this.createNotification(notification))
  }

  private createNotification(notification: Notification): void {
    const notificationElement: HTMLElement = this.createNotificationElement(notification)
    this.removeNotification(notification)
    this.insertNotificationIntoContainer(notificationElement)
    this.setRemoveNotificationTimer(notification)
    this.moveNotifications()
  }

  private createNotificationElement(notification: Notification): HTMLElement {
    const notificationComponentRef: ComponentRef<NotificationPopupComponent> = createComponent(NotificationPopupComponent, {
      environmentInjector: this.applicationRef.injector,
    })

    notificationComponentRef.instance.notification = notification
    notificationComponentRef.instance.isRemovable = true
    notificationComponentRef.instance.onRemoveCallback = (notification: Notification): void => this.removeNotification(notification)
    notificationComponentRef.changeDetectorRef.detectChanges()

    const notificationElement: HTMLElement = (<EmbeddedViewRef<NotificationPopupComponent>>notificationComponentRef.hostView).rootNodes[0]
    notificationElement.id = notification.id
    return notificationElement
  }

  private insertNotificationIntoContainer(notificationElement: HTMLElement): void {
    const host: HTMLElement = this.elementRef.nativeElement
    host.insertAdjacentElement('afterbegin', notificationElement)
    this.notificationElements.unshift(notificationElement)
  }

  private setRemoveNotificationTimer(notification: Notification): void {
    const timeout: NodeJS.Timeout = setTimeout(() => this.removeNotification(notification), NOTIFICATION_DURATION_MS)
    this.timeoutMap.set(notification.id, timeout)
  }

  private removeNotification(notification: Notification): void {
    const index: number = this.notificationElements.findIndex(element => element.id === notification.id)
    if (index === -1) {
      return
    }
    const notificationElement: HTMLElement = this.notificationElements[index]
    notificationElement.remove()

    this.notificationElements.splice(index, 1)

    this.stopTimeout(notification)
    this.moveNotifications()
  }

  private stopTimeout(notification: Notification): void {
    if (!this.timeoutMap.has(notification.id)) {
      return
    }
    const timeout: NodeJS.Timeout = this.timeoutMap.get(notification.id)!
    clearTimeout(timeout)
    this.timeoutMap.delete(notification.id)
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

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }
}
