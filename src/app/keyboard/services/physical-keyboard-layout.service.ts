import { KeyboardLayoutKey, KeyboardLayout } from '../value-objects/keyboard-layout'

export class PhysicalKeyboardLayoutService {
  constructor(private readonly keyboardLayoutMap: KeyboardLayoutMap) {
    this.registerCustomKeyboardLayoutMapEntries()
  }

  private registerCustomKeyboardLayoutMapEntries(): void {
    this.keyboardLayoutMap.set('Tab', '\u{21E5} Tab')
    this.keyboardLayoutMap.set('ControlLeft', '\u{2303} Control')
    this.keyboardLayoutMap.set('ControlRight', '\u{2303} Control')
    this.keyboardLayoutMap.set('ShiftLeft', '\u{21E7} Shift')
    this.keyboardLayoutMap.set('ShiftRight', '\u{21E7} Shift')
    this.keyboardLayoutMap.set('CapsLock', '\u{21EA} CapsLock')
    this.keyboardLayoutMap.set('AltLeft', '\u{2325}')
    this.keyboardLayoutMap.set('AltRight', '\u{2325}')
    this.keyboardLayoutMap.set('Space', 'Space')
    this.keyboardLayoutMap.set('Backspace', '\u{232B} Backspace')
    this.keyboardLayoutMap.set('Escape', '\u{238B} Esc')
    this.keyboardLayoutMap.set('MetaLeft', '\u{2318}')
    this.keyboardLayoutMap.set('MetaRight', '\u{2318}')
    this.keyboardLayoutMap.set('ArrowUp', '\u{2191}')
    this.keyboardLayoutMap.set('ArrowDown', '\u{2193}')
    this.keyboardLayoutMap.set('ArrowLeft', '\u{2190}')
    this.keyboardLayoutMap.set('ArrowRight', '\u{2192}')
    this.keyboardLayoutMap.set('Delete', '\u{2326}')
    this.keyboardLayoutMap.set('Space', '')
    this.keyboardLayoutMap.set('PageUp', 'PgUp')
    this.keyboardLayoutMap.set('PageDown', 'PgDn')
    this.keyboardLayoutMap.set('ContextMenu', '\u{2630}')
  }

  public createIso102KeyboardLayout(): KeyboardLayout {
    return {
      name: 'ISO 102',
      functionKeyRow: this.createIso102FunctionKeyRow(),
      mainKeyRows: this.createIso102MainKeyRows(),
      controlKeyRows: this.createIso102ControlKeyRows(),
    }
  }

  private createIso102FunctionKeyRow(): KeyboardLayoutKey[] {
    return [this.createKeyboardKey('Escape'), ...[...Array(12)].map((_, index) => index + 1).map(functionDigit => this.createKeyboardKey(`F${functionDigit}`, 1.177))]
  }

  private createIso102MainKeyRows(): KeyboardLayoutKey[][] {
    return [
      [
        this.createKeyboardKey('Backquote'),
        ...[...Array(10)].map((_, index) => (index + 1) % 10).map(digit => this.createKeyboardKey(`Digit${digit}`)),
        this.createKeyboardKey('Minus'),
        this.createKeyboardKey('Equal'),
        this.createKeyboardKey('Backspace', 2),
      ],
      [
        this.createKeyboardKey('Tab', 1.5),
        this.createKeyboardKey('KeyQ'),
        this.createKeyboardKey('KeyW'),
        this.createKeyboardKey('KeyE'),
        this.createKeyboardKey('KeyR'),
        this.createKeyboardKey('KeyT'),
        this.createKeyboardKey('KeyY'),
        this.createKeyboardKey('KeyU'),
        this.createKeyboardKey('KeyI'),
        this.createKeyboardKey('KeyO'),
        this.createKeyboardKey('KeyP'),
        this.createKeyboardKey('BracketLeft'),
        this.createKeyboardKey('BracketRight'),
      ],
      [
        this.createKeyboardKey('CapsLock', 2),
        this.createKeyboardKey('KeyA'),
        this.createKeyboardKey('KeyS'),
        this.createKeyboardKey('KeyD'),
        this.createKeyboardKey('KeyF'),
        this.createKeyboardKey('KeyG'),
        this.createKeyboardKey('KeyH'),
        this.createKeyboardKey('KeyJ'),
        this.createKeyboardKey('KeyK'),
        this.createKeyboardKey('KeyL'),
        this.createKeyboardKey('Semicolon'),
        this.createKeyboardKey('Quote'),
        this.createKeyboardKey('Backslash'),
        this.createKeyboardKey('Enter'),
      ],
      [
        this.createKeyboardKey('ShiftLeft', 1.3),
        this.createKeyboardKey('IntlBackslash'),
        this.createKeyboardKey('KeyZ'),
        this.createKeyboardKey('KeyX'),
        this.createKeyboardKey('KeyC'),
        this.createKeyboardKey('KeyV'),
        this.createKeyboardKey('KeyB'),
        this.createKeyboardKey('KeyN'),
        this.createKeyboardKey('KeyM'),
        this.createKeyboardKey('Comma'),
        this.createKeyboardKey('Period'),
        this.createKeyboardKey('Slash'),
        this.createKeyboardKey('ShiftRight', 2.85),
      ],
      [
        this.createKeyboardKey('ControlLeft', 1.4),
        this.createKeyboardKey('MetaLeft'),
        this.createKeyboardKey('AltLeft'),
        this.createKeyboardKey('Space', 7.42),
        this.createKeyboardKey('AltRight'),
        this.createKeyboardKey('MetaRight'),
        this.createKeyboardKey('ContextMenu'),
        this.createKeyboardKey('ControlRight', 1.95),
      ],
    ]
  }

  private createIso102ControlKeyRows(): KeyboardLayoutKey[][] {
    return [
      [],
      [this.createKeyboardKey('Insert'), this.createKeyboardKey('Home'), this.createKeyboardKey('PageUp')],
      [this.createKeyboardKey('Delete'), this.createKeyboardKey('End'), this.createKeyboardKey('PageDown')],
      [],
      [this.createKeyboardKey('<none>'), this.createKeyboardKey('ArrowUp'), this.createKeyboardKey('<none>')],
      [this.createKeyboardKey('ArrowLeft'), this.createKeyboardKey('ArrowDown'), this.createKeyboardKey('ArrowRight')],
    ]
  }

  private createKeyboardKey(key: string, widthScale: number = 1): KeyboardLayoutKey {
    const label: string = this.keyboardLayoutMap.get(key) ?? key
    return { key, label, widthScale }
  }
}
