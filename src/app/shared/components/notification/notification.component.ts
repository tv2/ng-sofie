import { Component, ElementRef, Input } from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

const INFO_COLOR: string = 'var(--blue-color)'
const WARNING_COLOR: string = 'var(--yellow-color)'
const ERROR_COLOR: string = 'var(--danger-color)'

const GRADIENT_DEGREE: string = 'var(--gradient-degree)'
const STATUS_COLOR_WIDTH: string = 'var(--status-color-width)'
const BACKGROUND_COLOR: string = 'var(--white-color)'

@Component({
  selector: 'sofie-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input()
  public onRemoveCallback: (element: HTMLElement) => void

  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize

  constructor(private readonly elementRef: ElementRef) {
    this.setBackground()
  }

  public remove(): void {
    this.onRemoveCallback(this.elementRef.nativeElement)
  }

  private setBackground(): void {
    const statusColor: string = this.getStatusColor()
    this.elementRef.nativeElement.style.background = `linear-gradient(${GRADIENT_DEGREE}, ${statusColor}, ${statusColor} ${STATUS_COLOR_WIDTH}, ${BACKGROUND_COLOR} ${STATUS_COLOR_WIDTH}, ${BACKGROUND_COLOR})`
  }

  private getStatusColor(): string {
    const isEven: number = Math.floor(Math.random() * 10) % 2
    return isEven ? INFO_COLOR : ERROR_COLOR
  }
}
