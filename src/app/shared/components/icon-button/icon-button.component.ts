import {Component, Input, OnInit} from '@angular/core';
import {IconProp, SizeProp} from "@fortawesome/fontawesome-svg-core";
import {IconButton, IconButtonSize} from "../../enums/icon-button";
import {faTrashCan, faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'sofie-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {

  @Input()
  public iconButton: IconButton

  @Input()
  public iconButtonSize: IconButtonSize

  public iconButtonProp: IconProp
  public iconButtonSizeProp: SizeProp

  constructor() {}

  ngOnInit(): void {
    this.iconButtonProp = this.getIconProperty(this.iconButton)
    this.iconButtonSizeProp = this.getIconSizeProperty(this.iconButtonSize)
  }

  public getIconProperty(iconButton: IconButton): IconProp {
    switch (iconButton) {
      case IconButton.XMARK:
        return faXmark
      case IconButton.DELETE:
        return faTrashCan
      default:
        return faXmark
    }
  }

  public getIconSizeProperty(iconButtonSize: IconButtonSize): SizeProp {
    switch (iconButtonSize) {
      case IconButtonSize.XS:
        return "xs"
      case IconButtonSize.SMALL:
        return "sm"
      case IconButtonSize.LARGE:
        return "lg"
      case IconButtonSize.XL:
        return "xl"
      case IconButtonSize.TWO_XL:
        return "2xl"
      default:
        return "1x"
    }
  }

}
