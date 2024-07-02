import { Injectable } from '@angular/core'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowsH,
  faBars,
  faCheck,
  faCircleExclamation,
  faCircleQuestion,
  faCopy,
  faKeyboard,
  faMinus,
  faPen,
  faPlus,
  faSort,
  faSortDown,
  faSortUp,
  faSquare,
  faSquareCheck,
  faSquareMinus,
  faTrashCan,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { Icon } from 'src/app/shared/enums/icon'
import { IconService } from '../../abstractions/icon.service'

@Injectable()
export class FortAwesomeIconService implements IconService {
  public getIconProperty(iconButton: Icon): IconProp {
    switch (iconButton) {
      case Icon.X_MARK:
        return faXmark
      case Icon.TRASH_CAN:
        return faTrashCan
      case Icon.BARS:
        return faBars
      case Icon.PLUS:
        return faPlus
      case Icon.MINUS:
        return faMinus
      case Icon.HORIZONTAL_ARROWS:
        return faArrowsH
      case Icon.TWO_SHEETS_COPY:
        return faCopy
      case Icon.VERTICAL_OPPOSING_TRIANGLES:
        return faSort
      case Icon.SQUARE:
        return faSquare
      case Icon.SQUARE_CHECK:
        return faSquareCheck
      case Icon.SQUARE_MINUS:
        return faSquareMinus
      case Icon.CHECK:
        return faCheck
      case Icon.PEN:
        return faPen
      case Icon.CIRCLE_QUESTION:
        return faCircleQuestion
      case Icon.DOWNWARD_TRIANGLE:
        return faSortDown
      case Icon.UPWARD_TRIANGLE:
        return faSortUp
      case Icon.TRIANGLE_EXCLAMATION:
        return faTriangleExclamation
      case Icon.CIRCLE_EXCLAMATION:
        return faCircleExclamation
      case Icon.KEYBOARD:
        return faKeyboard
      default:
        return faXmark
    }
  }
}
