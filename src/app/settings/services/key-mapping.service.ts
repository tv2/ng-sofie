import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class KeyMappingService {
  public mapKey(inputKey: string): string | undefined {
    switch (inputKey) {
      case 'KeyQ':
        return 'Q'
      case 'KeyW':
        return 'W'
      case 'KeyE':
        return 'E'
      case 'KeyR':
        return 'R'
      case 'KeyT':
        return 'T'
      case 'KeyY':
        return 'Y'
      case 'KeyU':
        return 'U'
      case 'KeyI':
        return 'I'
      case 'KeyO':
        return 'O'
      case 'KeyP':
        return 'P'
      case 'BracketLeft':
        return '['
      case 'BracketRight':
        return ']'
      case 'KeyA':
        return 'A'
      case 'KeyS':
        return 'S'
      case 'KeyD':
        return 'D'
      case 'KeyF':
        return 'F'
      case 'KeyG':
        return 'G'
      case 'KeyH':
        return 'H'
      case 'KeyJ':
        return 'J'
      case 'KeyK':
        return 'K'
      case 'KeyL':
        return 'L'
      case 'Semicolon':
        return ';'
      case 'Quote':
        return "'"
      case 'Backslash':
      case 'IntlBackslash':
        return '\\'
      case 'KeyZ':
        return 'Z'
      case 'KeyX':
        return 'X'
      case 'KeyC':
        return 'C'
      case 'KeyV':
        return 'V'
      case 'KeyB':
        return 'B'
      case 'KeyN':
        return 'N'
      case 'KeyM':
        return 'M'
      case 'Comma':
        return ','
      case 'Period':
        return '.'
      case 'Slash':
        return '/'
      case 'Space':
        return ' '
      case 'Digit1':
        return '1'
      case 'Digit2':
        return '2'
      case 'Digit3':
        return '3'
      case 'Digit4':
        return '4'
      case 'Digit5':
        return '5'
      case 'Digit6':
        return '6'
      case 'Digit7':
        return '7'
      case 'Digit8':
        return '8'
      case 'Digit9':
        return '9'
      case 'Digit0':
        return '0'
      case 'F1':
        return 'F1'
      case 'F2':
        return 'F2'
      case 'F3':
        return 'F3'
      case 'F4':
        return 'F4'
      case 'F5':
        return 'F5'
      case 'F6':
        return 'F6'
      case 'F7':
        return 'F7'
      case 'F8':
        return 'F8'
      case 'F9':
        return 'F9'
      case 'F10':
        return 'F10'
      case 'F11':
        return 'F11'
      case 'F12':
        return 'F12'
      case 'ShiftLeft':
      case 'ShiftRight':
        return 'Shift'
      case 'MetaLeft':
        return 'MetaLeft'
      case 'MetaRight':
        return 'MetaRight'
      case 'AltLeft':
        return 'AltLeft'
      case 'AltRight':
        return 'AltRight'
      case 'ControlLeft':
        return 'Control'
      case 'ControlRight':
        return 'Control'
      default:
        // eslint-disable-next-line no-console
        console.log(inputKey)
        return undefined
    }
  }
}
