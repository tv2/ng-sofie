export abstract class KeyboardKeyLabelService {
  public abstract getDefaultKeyLabels(): KeyboardLayoutMap
  public abstract getLocalKeyboardKeyLabels(): Promise<KeyboardLayoutMap>
}
