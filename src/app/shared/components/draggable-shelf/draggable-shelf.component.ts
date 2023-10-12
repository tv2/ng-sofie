import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild } from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

@Component({
  selector: 'sofie-draggable-shelf',
  templateUrl: './draggable-shelf.component.html',
  styleUrls: ['./draggable-shelf.component.scss'],
})
export class DraggableShelfComponent implements OnInit {
  // TODO: Rename to heightInPixels
  @HostBinding('style.flex-basis.px')
  @HostBinding('style.height.px')
  public dragOffsetInPixels: number = 0
  // TODO: Rename to verticalDragPositionFromDragHandleBottomInPixels
  public dragHandleOffsetInPixels?: number

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  @ViewChild('dragHandle')
  private readonly dragHandleElement: ElementRef<HTMLDivElement>

  @Input()
  public localStorageKeyForHeight?: string

  public ngOnInit(): void {
    this.dragOffsetInPixels = this.getInitialHeight()
  }

  private getInitialHeight(): number {
    if (!this.localStorageKeyForHeight) {
      return 0
    }

    const storedHeight: string | null = window.localStorage.getItem(this.localStorageKeyForHeight)
    if (!storedHeight) {
      return 0
    }

    const storedHeightInPixels: number = Number(storedHeight)
    if (Number.isNaN(storedHeight)) {
      return 0
    }

    return storedHeightInPixels
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
        this.storeHeight()
      },
      { once: true }
    )
  }

  private storeHeight(): void {
    if (!this.localStorageKeyForHeight) {
      return
    }
    window.localStorage.setItem(this.localStorageKeyForHeight, this.dragOffsetInPixels.toString())
  }

  public onDragMove(event: MouseEvent): void {
    if (this.dragHandleOffsetInPixels === undefined) {
      return
    }
    this.dragOffsetInPixels = window.innerHeight - event.clientY + this.dragHandleOffsetInPixels
  }
}
