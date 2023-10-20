import { KeyAliasService } from '../abstractions/key-alias-service'

export class Tv2KeyAliasService implements KeyAliasService {
  public getAliasesForKey(key: string): string[] {
    switch (key) {
      case 'AnyEnter':
        return ['Enter', 'NumpadEnter']
      case 'Shift':
        return ['ShiftLeft', 'ShiftRight']
      case 'Control':
        return ['ControlLeft', 'ControlRight']
      case 'Alt':
      case 'Option':
        return ['AltLeft', 'AltRight']
      case 'Meta':
        return ['MetaLeft', 'MetaRight']
      case 'OS':
      case 'Command':
      case 'Windows':
        return ['OSLeft', 'OSRight']
      default:
        return [key]
    }
  }
}
