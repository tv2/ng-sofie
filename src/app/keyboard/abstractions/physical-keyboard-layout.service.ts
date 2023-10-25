import { KeyboardLayout } from '../value-objects/keyboard-layout'

export abstract class PhysicalKeyboardLayoutService {
  public abstract registerKeyboardKeyLabels(keyboardKeyLabels: KeyboardLayoutMap): void
  public abstract getPhysicalKeyboardLayout(): KeyboardLayout
}
