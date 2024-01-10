import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { IconsUtil } from 'src/app/helper/icons.util'

@Component({
  selector: 'sofie-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {
  @Input() public iconButtonSize: IconButtonSize
  @Input() public iconButton: IconButton
  @Input() public label: string = ''
  @Input() public selected: string = ''
  @Output() public readonly btnClick: EventEmitter<void> = new EventEmitter<void>()

  public iconButtonSizeProp: SizeProp
  public iconButtonProp: IconProp

  public ngOnInit(): void {
    if (this.iconButton && this.iconButtonSize) {
      this.iconButtonProp = IconsUtil.getIconProperty(this.iconButton)
      this.iconButtonSizeProp = IconsUtil.getIconSizeProperty(this.iconButtonSize ?? IconButtonSize.M)
    }
  }
}
