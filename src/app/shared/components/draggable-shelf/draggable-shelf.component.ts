import {Component, ElementRef, HostBinding, HostListener, ViewChild} from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

@Component({
  selector: 'sofie-draggable-shelf',
  templateUrl: './draggable-shelf.component.html',
  styleUrls: ['./draggable-shelf.component.scss'],
})
export class DraggableShelfComponent {
  public dragOffsetInPixels: number = 0
  public dragHandleOffsetInPixels?: number

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  @ViewChild('dragHandle')
  private readonly dragHandleElement: ElementRef<HTMLDivElement>

  @HostBinding('style.flex-basis.px')
  public get flexBasisInPixels(): number {
    return this.dragOffsetInPixels
  }

  @HostBinding('style.height.px')
  public get heightInPixels(): number {
    return this.dragOffsetInPixels
  }

  @HostListener('mousedown', ['$event'])
  public onDragStart(event: MouseEvent): void {
    const dragHandleBottomInPixels: number = this.dragHandleElement.nativeElement.getBoundingClientRect().bottom
    this.dragHandleOffsetInPixels = event.clientY - dragHandleBottomInPixels
    const onDragMove: (event: MouseEvent) => void = this.onDragMove.bind(this)
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener(
      'mouseup',
      () => {
        this.dragHandleOffsetInPixels = undefined
        window.removeEventListener('mousemove', onDragMove)
      },
      { once: true }
    )
  }

  public onDragMove(event: MouseEvent): void {
    if (this.dragHandleOffsetInPixels === undefined) {
      return
    }
    this.dragOffsetInPixels = window.innerHeight - event.clientY + this.dragHandleOffsetInPixels
  }
}
