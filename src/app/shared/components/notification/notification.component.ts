import { Component, ElementRef, Input } from '@angular/core'

@Component({
  selector: 'sofie-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input()
  public onRemoveCallback: (element: HTMLElement) => void

  constructor(private readonly elementRef: ElementRef) {}

  public remove(): void {
    this.onRemoveCallback(this.elementRef.nativeElement)
  }
}
