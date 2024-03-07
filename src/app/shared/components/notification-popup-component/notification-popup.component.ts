import { Component, Input } from '@angular/core'
import { Notification } from '../../models/notification'

@Component({
  selector: 'sofie-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
})
export class NotificationPopupComponent {
  @Input()
  public notification: Notification
  @Input()
  public isRemovable: boolean
  @Input()
  public onRemoveCallback: (notification: Notification) => void

  constructor() {}
}
