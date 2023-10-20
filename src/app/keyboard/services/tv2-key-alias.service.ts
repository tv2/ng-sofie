import { KeyAliasService } from '../abstractions/key-alias-service'

export class Tv2KeyAliasService implements KeyAliasService {
  private readonly modifierKeys: string[] = ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'OSLeft', 'OSRight']

  public getKeysFromKeyAlias(keyAlias: string): string[] {
    switch (keyAlias) {
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
      default:
        return [keyAlias]
    }
  }

  public isModifierKeyOrAliasedModifierKey(keyAlias: string): boolean {
    return this.getKeysFromKeyAlias(keyAlias).some(key => this.modifierKeys.includes(key))
  }

  public isKeyPartOfAlias(key: string, keyAlias: string): boolean {
    return this.getKeysFromKeyAlias(keyAlias).includes(key)
  }
}
