import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild } from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

interface PositionData {
  heightInPixels: number,
  isCollapsed: boolean,
}

@Component({
  selector: 'sofie-draggable-shelf',
  templateUrl: './draggable-shelf.component.html',
  styleUrls: ['./draggable-shelf.component.scss'],
})
export class DraggableShelfComponent implements OnInit {
  public isCollapsed: boolean = false
  public heightInPixels: number = 0
  public verticalDragPositionFromDragHandleBottomInPixels?: number

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  @ViewChild('dragHandle')
  private readonly dragHandleElement: ElementRef<HTMLDivElement>

  @Input()
  public localStorageKey?: string

  public ngOnInit(): void {
    this.loadInitialPosition()
  }

  private loadInitialPosition(): void {
    if (!this.localStorageKey) {
      return
    }

    const positionDataAsText: string | null = window.localStorage.getItem(this.localStorageKey)
    if (!positionDataAsText) {
      return
    }

    try {
      const positionData: PositionData = JSON.parse(positionDataAsText)
      this.isCollapsed = positionData.isCollapsed
      this.heightInPixels = positionData.heightInPixels
    } catch {}
  }

  @HostBinding('style.flex-basis.px')
  @HostBinding('style.height.px')
  public get displayHeight(): number {
    if (this.isCollapsed) {
      return 0
    }
    return this.heightInPixels
  }

  @HostListener('mousedown', ['$event'])
  public onDragStart(event: MouseEvent): void {
    if (!this.dragHandleElement.nativeElement.contains(event.target as Node | null)) {
      return
    }
    const dragHandleBottomInPixels: number = this.dragHandleElement.nativeElement.getBoundingClientRect().bottom
    this.verticalDragPositionFromDragHandleBottomInPixels = event.clientY - dragHandleBottomInPixels
    const onDragMove: (event: MouseEvent) => void = this.onDragMove.bind(this)
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener(
      'mouseup',
      () => {
        this.verticalDragPositionFromDragHandleBottomInPixels = undefined
        window.removeEventListener('mousemove', onDragMove)
        this.storePositionData()
      },
      { once: true }
    )
  }

  private storePositionData(): void {
    if (!this.localStorageKey) {
      return
    }
    const positionData: PositionData = {
      heightInPixels: this.heightInPixels,
      isCollapsed: this.isCollapsed,
    }
    window.localStorage.setItem(this.localStorageKey, JSON.stringify(positionData))
  }

  public onDragMove(event: MouseEvent): void {
    if (this.isCollapsed) {
      this.toggleCollapse()
    }
    if (this.verticalDragPositionFromDragHandleBottomInPixels === undefined) {
      return
    }
    this.heightInPixels = window.innerHeight - event.clientY + this.verticalDragPositionFromDragHandleBottomInPixels
  }

  protected toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed
    this.storePositionData()
  }
}
