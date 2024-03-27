import { Component, ElementRef, Input, OnInit } from '@angular/core'
import { Icon, IconSize } from '../../enums/icon'
import { Notification } from '../../models/notification'
import { StatusCode } from '../../enums/status-code'

const INFO_COLOR: string = 'var(--info-color)'
const WARNING_COLOR: string = 'var(--attention-color)'
const ERROR_COLOR: string = 'var(--danger-color)'

const GRADIENT_DEGREE: string = 'var(--gradient-degree)'
const STATUS_COLOR_WIDTH: string = 'var(--status-color-width)'
const BACKGROUND_COLOR: string = 'var(--white-color)'

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
    this.setBackground()
  }

  public remove(): void {
    this.onRemoveCallback(this.notification)
  }

  private setBackground(): void {
    const statusColor: string = this.getStatusColor()
    this.elementRef.nativeElement.style.background = `linear-gradient(${GRADIENT_DEGREE}, ${statusColor}, ${statusColor} ${STATUS_COLOR_WIDTH}, ${BACKGROUND_COLOR} ${STATUS_COLOR_WIDTH}, ${BACKGROUND_COLOR})`
  }

  private getStatusColor(): string {
    switch (this.notification.statusCode) {
      case StatusCode.BAD:
        return ERROR_COLOR
      case StatusCode.WARNING:
        return WARNING_COLOR
      case StatusCode.GOOD:
      case StatusCode.UNKNOWN:
        return INFO_COLOR
    }
  }
}
