import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core'
import { KeyboardBindingService } from '../../abstractions/keyboard-binding.service'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'
import { KeyBinding } from '../../../keyboard/models/key-binding'
import { KeyBindingMatcher } from '../../../keyboard/abstractions/key-binding-matcher.service'

const PRODUCER_SHELF_HEIGHT_LOCAL_STORAGE_KEY: string = 'producer-shelf-height'

@Component({
  selector: 'sofie-producer-shelf',
  templateUrl: './producer-shelf.component.html',
  styleUrls: ['./producer-shelf.component.scss'],
})
export class ProducerShelfComponent implements OnDestroy {
  public keyBindings: KeyBinding[] = []
  public pressedKeys: string[] = []
  public dragOffsetInPixels: number = 0
  public dragHandleOffsetInPixels?: number

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  @ViewChild('dragHandle')
  private readonly dragHandleElement: ElementRef<HTMLDivElement>

  constructor(
    private readonly keyboardBindingService: KeyboardBindingService,
    private readonly keyBindingMatcher: KeyBindingMatcher
  ) {
    // TODO: handle closing subscriptions on teardown
    this.keyboardBindingService.subscribeToKeybindings((keyBindings: KeyBinding[]) => (this.keyBindings = keyBindings))
    this.keyboardBindingService.subscribeToPressedKeys((pressedKeys: string[]) => (this.pressedKeys = pressedKeys))
    this.dragOffsetInPixels = this.getInitialHeight()
  }

  private getInitialHeight(): number {
    try {
      const storedHeight: string | null = window.localStorage.getItem(PRODUCER_SHELF_HEIGHT_LOCAL_STORAGE_KEY)
      if (!storedHeight) {
        return 0
      }
      const storedHeightInPixels: number = Number(storedHeight)
      if (Number.isNaN(storedHeight)) {
        return 0
      }
      return storedHeightInPixels
    } catch {
      return 0
    }
  }

  public ngOnDestroy(): void {
    this.keyboardBindingService.unsubscribe()
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
        window.localStorage.setItem(PRODUCER_SHELF_HEIGHT_LOCAL_STORAGE_KEY, this.dragOffsetInPixels.toString())
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

  public displayKeyBinding(keyBinding: KeyBinding): string {
    return keyBinding.keys.join('+')
  }

  public isKeyBindingMatched(keyBinding: KeyBinding): boolean {
    return this.keyBindingMatcher.isMatching(keyBinding, this.pressedKeys, true)
  }
}
