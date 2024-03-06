import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { IconService } from 'src/app/core/abstractions/icon.service'

@Component({
  selector: 'sofie-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent implements OnInit, OnChanges {
  @Input()
  public iconButton: IconButton

  @Input()
  public iconButtonSize: IconButtonSize

  @Input()
  public tooltipText: string = ''

  @Input()
  @HostBinding('attr.disabled')
  public disabled: boolean = false

  public iconButtonProp: IconProp
  public iconButtonSizeProp: SizeProp

  constructor(private readonly iconService: IconService) {}

  public ngOnInit(): void {
    this.updateIcon()
  }

  private updateIcon(): void {
    this.iconButtonProp = this.iconService.getIconProperty(this.iconButton)
    this.iconButtonSizeProp = this.iconButtonSize ? this.iconButtonSize : IconButtonSize.M
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('iconButton' in changes || 'iconButtonSize' in changes) {
      this.updateIcon()
    }
  }
}
