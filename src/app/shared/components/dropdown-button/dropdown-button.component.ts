import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { HttpIconService } from 'src/app/core/services/http/http-icon.service'

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
  constructor(private readonly iconService: HttpIconService) {}

  public iconButtonSizeProp: SizeProp
  public iconButtonProp: IconProp

  public ngOnInit(): void {
    this.iconButtonProp = this.iconService.getIconProperty(this.iconButton)
    this.iconButtonSizeProp = this.iconButtonSize ? this.iconButtonSize : IconButtonSize.M
  }

  public selectOption(option: SofieDroppdownOptions): void {
    this.optionSelect.emit(option.key)
  }
}
