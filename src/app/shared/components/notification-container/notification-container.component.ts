import { AfterViewInit, ApplicationRef, Component, ComponentRef, createComponent, ElementRef, EmbeddedViewRef, Input, OnDestroy, OnInit } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { Subject, takeUntil } from 'rxjs'
import { NotificationComponent } from '../notification/notification.component'

const NOTIFICATION_DURATION_MS: number = 5000
const TOP_PADDING: number = 5
const PIXEL_POSTFIX: string = 'px'

const STACK_GAP: number = 15

@Component({
  selector: 'sofie-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
})
export class NotificationContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public topOffset: number

  private readonly destroySubject: Subject<void> = new Subject()

  private readonly notificationElements: HTMLElement[] = []

  constructor(
    private readonly elementRef: ElementRef,
    private readonly applicationRef: ApplicationRef,
    private readonly notificationService: NotificationService
  ) {}

  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.style.top = TOP_PADDING + this.topOffset + PIXEL_POSTFIX
  }

  public ngOnInit(): void {
    this.notificationService
      .subscribeToNotifications()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => this.createNotification())
  }

  private createNotification(): void {
    const notificationElement: HTMLElement = this.createNotificationElement()
    this.insertNotificationIntoContainer(notificationElement)
    this.setRemoveNotificationTimer(notificationElement)
    this.moveNotificationsDown()
  }

  private createNotificationElement(): HTMLElement {
    const notificationComponentRef: ComponentRef<NotificationComponent> = createComponent(NotificationComponent, {
      environmentInjector: this.applicationRef.injector,
    })

    notificationComponentRef.instance.onRemoveCallback = (notificationElement: HTMLElement): void => this.removeNotificationElement(notificationElement)
    notificationComponentRef.changeDetectorRef.detectChanges()

    return (<EmbeddedViewRef<NotificationComponent>>notificationComponentRef.hostView).rootNodes[0]
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

    for (let i = index; i < this.notificationElements.length; i++) {
      const element: HTMLElement = this.notificationElements[i]
      element.style.top = (element.offsetHeight + STACK_GAP) * i + PIXEL_POSTFIX
    }
  }

  private moveNotificationsDown(): void {
    if (this.notificationElements.length < 2) {
      return
    }
    const offsetGap: number = 0
    let spaceFromTop: number = this.notificationElements[0].offsetHeight + offsetGap + STACK_GAP
    for (let i = 1; i < this.notificationElements.length; i++) {
      const notificationElement: HTMLElement = this.notificationElements[i]
      notificationElement.style.top = spaceFromTop + PIXEL_POSTFIX
      spaceFromTop += notificationElement.offsetHeight + STACK_GAP
    }
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }
}
