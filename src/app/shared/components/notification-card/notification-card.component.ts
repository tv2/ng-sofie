import { Component, ElementRef, Input, OnInit } from '@angular/core'
import { Icon, IconSize } from '../../enums/icon'
import { Notification } from '../../models/notification'

@Component({
  selector: 'sofie-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent implements OnInit {
  @Input()
  public notification: Notification

  @Input()
  public isRemovable: boolean

  @Input()
  public onRemoveCallback: (notification: Notification) => void

  public readonly Icon = Icon
  public readonly IconSize = IconSize

  constructor(private readonly elementRef: ElementRef) {}

  public ngOnInit(): void {
    this.setClassName()
  }

  public remove(): void {
    this.onRemoveCallback(this.notification)
  }

  private setClassName(): void {
    this.elementRef.nativeElement.classList.add(this.notification.statusCode.toLocaleLowerCase())
  }
}
