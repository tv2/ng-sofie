import { Injectable } from '@angular/core'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsH, faBars, faCircleQuestion, faCopy, faFilter, faMinus, faPen, faPlus, faSort, faSquareCheck, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'

export interface IconService {
  getIconProperty(iconButton: IconButton): IconProp
  getIconSizeProperty(iconButton: IconButtonSize): SizeProp
}

@Injectable()
export class HttpIconService implements IconService {
  public getIconProperty(iconButton: IconButton): IconProp {
    switch (iconButton) {
      case IconButton.XMARK:
        return faXmark
      case IconButton.TRASH_CAN:
        return faTrashCan
      case IconButton.BARS:
        return faBars
      case IconButton.PLUS:
        return faPlus
      case IconButton.MINUS:
        return faMinus
      case IconButton.HORIZONTAL_ARROWS:
        return faArrowsH
      case IconButton.COPY:
        return faCopy
      case IconButton.FILTER:
        return faFilter
      case IconButton.SORT:
        return faSort
      case IconButton.SQUARE_CHECK:
        return faSquareCheck
      case IconButton.PEN:
        return faPen
      case IconButton.CIRCLE_QUESTION:
        return faCircleQuestion
      default:
        return faXmark
    }
  }

  public getIconSizeProperty(iconButtonSize: IconButtonSize): SizeProp {
    switch (iconButtonSize) {
      case IconButtonSize.XS:
        return 'xs'
      case IconButtonSize.S:
        return 'sm'
      case IconButtonSize.M:
        return '1x'
      case IconButtonSize.L:
        return 'lg'
      case IconButtonSize.XL:
        return 'xl'
      case IconButtonSize.XXL:
        return '2xl'
      default:
        return '1x'
    }
  }
}
