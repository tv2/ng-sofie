import { KeyAliasService } from '../abstractions/key-alias-service'
import { KeyAlias } from '../value-objects/key-alias'

export class Tv2KeyAliasService implements KeyAliasService {
  private readonly modifierKeys: string[] = ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'OSLeft', 'OSRight']

  public getKeysFromKeyAlias(keyAlias: string): string[] {
    switch (keyAlias) {
      case KeyAlias.ANY_ENTER:
        return ['Enter', 'NumpadEnter']
      case KeyAlias.SHIFT:
        return ['ShiftLeft', 'ShiftRight']
      case KeyAlias.CONTROL:
        return ['ControlLeft', 'ControlRight']
      case KeyAlias.ALT:
      case KeyAlias.OPTION:
        return ['AltLeft', 'AltRight']
      case KeyAlias.META:
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
