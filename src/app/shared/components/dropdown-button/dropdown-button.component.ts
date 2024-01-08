import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { IconsUtil } from 'src/app/helper/icons.util'

export interface SofieDroppdownOptions {
  label: string
  key: string
  disabled?: boolean
}

@Component({
  selector: 'sofie-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownButtonComponent implements OnInit {
  @Input() public iconButtonSize: IconButtonSize
  @Input() public iconButton: IconButton
  @Input() public label: string = ''
  @Input() public selected: string = ''
  @Input() public options: SofieDroppdownOptions[]
  @Output() private readonly optionSelect: EventEmitter<string> = new EventEmitter<string>()

  public iconButtonSizeProp: SizeProp
  public iconButtonProp: IconProp

  public ngOnInit(): void {
    this.iconButtonProp = IconsUtil.getIconProperty(this.iconButton)
    this.iconButtonSizeProp = IconsUtil.getIconSizeProperty(this.iconButtonSize ?? IconButtonSize.M)
  }

  public selectOption(option: SofieDroppdownOptions): void {
    this.optionSelect.emit(option.key)
  }
}
