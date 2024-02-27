import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { IconService } from 'src/app/core/abstractions/icon.service'

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
  @Input() public buttonClasses: string
  @Output() public readonly onClick: EventEmitter<void> = new EventEmitter<void>()
  constructor(private readonly iconService: IconService) {}

  public iconButtonSizeProp: SizeProp
  public iconButtonProp: IconProp

  public ngOnInit(): void {
    if (this.iconButton && this.iconButtonSize) {
      this.iconButtonProp = this.iconService.getIconProperty(this.iconButton)
      this.iconButtonSizeProp = this.iconButtonSize ? this.iconButtonSize : IconButtonSize.M
    }
  }
}
