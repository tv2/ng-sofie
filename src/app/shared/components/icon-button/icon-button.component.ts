import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { Icon, IconSize } from '../../enums/icon'
import { IconService } from 'src/app/core/abstractions/icon.service'

@Component({
  selector: 'sofie-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent implements OnInit, OnChanges {
  @Input()
  public icon: Icon

  @Input()
  public iconSize: IconSize

  @Input()
  public tooltip: string = ''

  @Input()
  @HostBinding('attr.disabled')
  public disabled: boolean = false

  public iconProp: IconProp
  public iconSizeProp: SizeProp

  constructor(private readonly iconService: IconService) {}

  public ngOnInit(): void {
    this.updateIcon()
  }

  private updateIcon(): void {
    this.iconProp = this.iconService.getIconProperty(this.icon)
    this.iconSizeProp = this.iconSize ? this.iconSize : IconSize.M
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('icon' in changes || 'iconSize' in changes) {
      this.updateIcon()
    }
  }
}
