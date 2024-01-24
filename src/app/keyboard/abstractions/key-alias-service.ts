export abstract class KeyAliasService {
  public abstract getKeysFromKeyAlias(key: string): string[]
  public abstract isModifierKeyOrAliasedModifierKey(key: string): boolean
  public abstract isKeyPartOfAlias(key: string, keyAlias: string): boolean
}
