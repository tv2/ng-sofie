import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Icon } from 'src/app/shared/enums/icon'

export abstract class IconService {
  public abstract getIconProperty(icon: Icon): IconProp
}
