import { Injectable } from '@angular/core'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsH, faBars, faCircleQuestion, faCopy, faMinus, faPen, faPlus, faSort, faSquareCheck, faTrashCan, faXmark, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from 'src/app/shared/enums/icon-button'
import { IconService } from '../../abstractions/icon.service'

@Injectable()
export class FortAwesomeIconService implements IconService {
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
      case IconButton.TWO_SHEETS_COPY:
        return faCopy
      case IconButton.VERTICAL_OPPOSING_TRIANGLES:
        return faSort
      case IconButton.SQUARE_CHECK:
        return faSquareCheck
      case IconButton.PEN:
        return faPen
      case IconButton.CIRCLE_QUESTION:
        return faCircleQuestion
      case IconButton.TRIANGLE_EXCLAMATION:
        return faTriangleExclamation
      default:
        return faXmark
    }
  }
}
