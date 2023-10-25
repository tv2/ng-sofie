import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'sofie-virtual-keyboard-key',
  templateUrl: './virtual-keyboard-key.component.html',
  styleUrls: ['./virtual-keyboard-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualKeyboardKeyComponent {
  @Input()
  public key: string

  @HostBinding('class')
  public get keyClass(): string {
    return this.key ? this.key.toLowerCase() : 'none'
  }

  @Input()
  public label?: string

  @Input()
  @HostBinding('class.matched')
  public isMatched: boolean = false

  @Input()
  public keyboardLayout: KeyboardLayoutMap

  @Input()
  @HostBinding('style.--key-weight')
  public weight: number = 1

  @Input()
  @HostBinding('style.background')
  public background?: string

  public get mappedKey(): string {
    const mappedKey: string = this.keyboardLayout.get(this.key) ?? this.key
    return mappedKey.length === 1 ? mappedKey.toUpperCase() : mappedKey
  }
}
