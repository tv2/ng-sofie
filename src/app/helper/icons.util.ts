import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton, IconButtonSize } from '../shared/enums/icon-button'
import { faArrowsH, faBars, faCopy, faFilter, faMinus, faPen, faPlus, faSort, faSquareCheck, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'

export class IconsUtil {
  public static getIconProperty(iconButton: IconButton): IconProp {
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
      default:
        return faXmark
    }
  }

  public static getIconSizeProperty(iconButtonSize: IconButtonSize): SizeProp {
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
