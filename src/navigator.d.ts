declare interface Navigator {
  keyboard?: Keyboard
}

interface Keyboard {
  getLayoutMap(): Promise<KeyboardLayoutMap>
}

declare type KeyboardLayoutMap = Map<string, string>
