import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'sofie-virtual-keyboard-key',
  templateUrl: './virtual-keyboard-key.component.html',
  styleUrls: ['./virtual-keyboard-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualKeyboardKeyComponent {
  @Input()
  public keyLabel: string

  @HostBinding('class')
  public get keyClass(): string {
    return this.keyLabel === 'EMPTY_KEY' ? 'none' : this.keyLabel.toLowerCase()
  }

  @Input()
  public label?: string

  @Input()
  @HostBinding('class.matched')
  public isMatched: boolean = false

  @Input()
  @HostBinding('style.--key-weight')
  public weight: number = 1

  @Input()
  @HostBinding('style.background')
  public background?: string

  public get capitalizedKey(): string {
    return `${this.keyLabel.charAt(0).toUpperCase()}${this.keyLabel.slice(1)}`
  }
}
