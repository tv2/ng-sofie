import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { IconButton } from 'src/app/shared/enums/icon-button'

export abstract class IconService {
  public abstract getIconProperty(iconButton: IconButton): IconProp
}
