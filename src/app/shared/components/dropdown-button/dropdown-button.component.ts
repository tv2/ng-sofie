import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { IconService } from 'src/app/core/abstractions/icon.service'

export interface SofieDroppdownOption {
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
  @Input() public selectedKey: string = ''
  @Input() public options: SofieDroppdownOption[]
  @Output() private readonly onSelect: EventEmitter<string> = new EventEmitter<string>()
  constructor(private readonly iconService: IconService) {}

  public iconButtonSizeProp: SizeProp
  public iconButtonProp: IconProp

  public ngOnInit(): void {
    this.iconButtonProp = this.iconService.getIconProperty(this.iconButton)
    this.iconButtonSizeProp = this.iconButtonSize ? this.iconButtonSize : IconButtonSize.M
  }

  public onNewOptionSelected(option: SofieDroppdownOption): void {
    this.onSelect.emit(option.key)
  }
}
