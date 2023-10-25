import { KeyboardKeyLabelService } from '../abstractions/keyboard-key-label.service'

export class Tv2KeyboardKeyLabelService implements KeyboardKeyLabelService {
  public getDefaultKeyLabels(): KeyboardLayoutMap {
    return this.getKeyLabelsForSpecialKeys()
  }

  private getKeyLabelsForSpecialKeys(): KeyboardLayoutMap {
    const specialKeyLabels: KeyboardLayoutMap = new Map()
    specialKeyLabels.set('Tab', '\u{21E5} Tab')
    specialKeyLabels.set('ControlLeft', '\u{2303} Control')
    specialKeyLabels.set('ControlRight', '\u{2303} Control')
    specialKeyLabels.set('ShiftLeft', '\u{21E7} Shift')
    specialKeyLabels.set('ShiftRight', '\u{21E7} Shift')
    specialKeyLabels.set('CapsLock', '\u{21EA} CapsLock')
    specialKeyLabels.set('AltLeft', '\u{2325}')
    specialKeyLabels.set('AltRight', '\u{2325}')
    specialKeyLabels.set('Space', 'Space')
    specialKeyLabels.set('Backspace', '\u{232B} Backspace')
    specialKeyLabels.set('Escape', '\u{238B} Esc')
    specialKeyLabels.set('MetaLeft', '\u{2318}')
    specialKeyLabels.set('MetaRight', '\u{2318}')
    specialKeyLabels.set('ArrowUp', '\u{2191}')
    specialKeyLabels.set('ArrowDown', '\u{2193}')
    specialKeyLabels.set('ArrowLeft', '\u{2190}')
    specialKeyLabels.set('ArrowRight', '\u{2192}')
    specialKeyLabels.set('Delete', '\u{2326}')
    specialKeyLabels.set('Space', '')
    specialKeyLabels.set('PageUp', 'PgUp')
    specialKeyLabels.set('PageDown', 'PgDn')
    specialKeyLabels.set('ContextMenu', '\u{2630}')
    return specialKeyLabels
  }

  public async getLocalKeyboardKeyLabels(): Promise<KeyboardLayoutMap> {
    if (!window.navigator.keyboard) {
      throw new Error('The keyboard layout is not available.')
    }
    const keyLabels: KeyboardLayoutMap = await window.navigator.keyboard.getLayoutMap()
    const defaultKeyLabels: KeyboardLayoutMap = this.getDefaultKeyLabels()
    return new Map([...defaultKeyLabels, ...keyLabels])
  }
}
