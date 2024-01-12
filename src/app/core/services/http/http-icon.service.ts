import { Injectable } from '@angular/core'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsH, faBars, faCircleQuestion, faCopy, faFilter, faMinus, faPen, faPlus, faSort, faSquareCheck, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from 'src/app/shared/enums/icon-button'

export interface IconService {
  getIconProperty(iconButton: IconButton): IconProp
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
}
