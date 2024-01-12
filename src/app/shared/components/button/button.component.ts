import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { HttpIconService } from 'src/app/core/services/http/http-icon.service'

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
  constructor(private readonly iconService: HttpIconService) {}

  public iconButtonSizeProp: SizeProp
  public iconButtonProp: IconProp

  public ngOnInit(): void {
    if (this.iconButton && this.iconButtonSize) {
      this.iconButtonProp = this.iconService.getIconProperty(this.iconButton)
      this.iconButtonSizeProp = this.iconService.getIconSizeProperty(this.iconButtonSize ?? IconButtonSize.M)
    }
  }
}
