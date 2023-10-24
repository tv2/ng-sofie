export abstract class KeyAliasService {
  public abstract getAliasesForKey(key: string): string[]
}
