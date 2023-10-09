import { Component, HostListener } from '@angular/core'
import { KeyboardBindingService } from '../../abstractions/keyboard-binding.service'
import { KeyBinding } from '../../models/key-binding'
import { KeyboardBindingMatcher } from '../../services/keyboard-binding.matcher'
import {IconButton, IconButtonSize} from "../../../shared/enums/icon-button";

@Component({
  selector: 'sofie-producer-shelf',
  templateUrl: './producer-shelf.component.html',
  styleUrls: ['./producer-shelf.component.scss'],
})
export class ProducerShelfComponent {
  public keyBindings: KeyBinding[] = []
  public pressedKeys: string[] = []

  @HostListener('mousedown', ['$event'])
  public onDragStart(event: MouseEvent): void {
    this.verticalDragStartPoint = event.clientY
    const onDragMove: (event: MouseEvent) => void = this.onDragMove.bind(this)
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener(
      'mouseup',
      () => {
        this.verticalDragStartPoint = undefined
        window.removeEventListener('mousemove', onDragMove)
      },
      { once: true }
    )
  }

  public scrollOffset: number = 0

  private verticalDragStartPoint?: number

  constructor(
    private readonly keyboardBindingService: KeyboardBindingService,
    private readonly keyboardBindingMatcher: KeyboardBindingMatcher
  ) {
    // TODO: handle closing subscriptions on teardown
    this.keyboardBindingService.subscribeToKeybindings((keyBindings: KeyBinding[]) => (this.keyBindings = keyBindings))
    this.keyboardBindingService.subscribeToPressedKeys((pressedKeys: string[]) => (this.pressedKeys = pressedKeys))
  }

  public displayKeyBinding(keyBinding: KeyBinding): string {
    return [...keyBinding.modifiers, keyBinding.key].join('+')
  }

  public isKeyBindingMatched(keyBinding: KeyBinding): boolean {
    return this.keyboardBindingMatcher.isKeyBindingMatchedExactly(keyBinding, this.pressedKeys)
  }

  public onDragMove(event: MouseEvent): void {
    //TODO: change to use the offset height from bottom to cursor, so we can drag off screen.
    event.preventDefault()
    if (!this.verticalDragStartPoint) {
      return
    }
    const newVerticalPoint: number = event.clientY
    const verticalDeltaInPixels: number = this.verticalDragStartPoint - newVerticalPoint
    this.verticalDragStartPoint = newVerticalPoint
    this.scrollOffset = this.scrollOffset + verticalDeltaInPixels
  }

  protected readonly IconButton = IconButton;
  protected readonly IconButtonSize = IconButtonSize;
}
