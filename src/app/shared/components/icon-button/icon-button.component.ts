import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { IconsUtil } from 'src/app/helper/icons.util'

@Component({
  selector: 'sofie-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent implements OnInit {
  @Input()
  public iconButton: IconButton

  @Input()
  public iconButtonSize: IconButtonSize

  @Input()
  @HostBinding('attr.disabled')
  public disabled: boolean = false

  public iconButtonProp: IconProp
  public iconButtonSizeProp: SizeProp

  public ngOnInit(): void {
    this.iconButtonProp = IconsUtil.getIconProperty(this.iconButton)
    this.iconButtonSizeProp = IconsUtil.getIconSizeProperty(this.iconButtonSize ?? IconButtonSize.M)
  }
}
