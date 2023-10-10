import {Component, ElementRef, HostListener, ViewChild} from '@angular/core'
import { KeyboardBindingService } from '../../abstractions/keyboard-binding.service'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'
import { KeyBinding } from '../../../keyboard/models/key-binding'
import { KeyBindingMatcher } from '../../../keyboard/abstractions/key-binding-matcher.service'

@Component({
  selector: 'sofie-producer-shelf',
  templateUrl: './producer-shelf.component.html',
  styleUrls: ['./producer-shelf.component.scss'],
})
export class ProducerShelfComponent {
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

  public displayKeyBinding(keyBinding: KeyBinding): string {
    return keyBinding.keys.join('+')
  }

  public isKeyBindingMatched(keyBinding: KeyBinding): boolean {
    return this.keyBindingMatcher.isMatching(keyBinding, this.pressedKeys, true)
  }
}
