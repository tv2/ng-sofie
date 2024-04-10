import { Component, HostBinding, Input } from '@angular/core'
import { Icon, IconSize } from '../../enums/icon'
import { Notification } from '../../models/notification'

@Component({
  selector: 'sofie-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent {
  @Input()
  public notification: Notification

  @Input()
  public isRemovable: boolean

  @Input()
  public onRemoveCallback: (notification: Notification) => void

  public readonly Icon = Icon
  public readonly IconSize = IconSize

  constructor() {}

  @HostBinding('class')
  protected get statusCodeClassName(): string {
    return this.notification.statusCode.toLocaleLowerCase()
  }

  public remove(): void {
    this.onRemoveCallback(this.notification)
  }
}
