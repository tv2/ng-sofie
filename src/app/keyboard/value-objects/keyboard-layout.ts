export interface KeyboardLayout {
  name: string
  functionKeyRow: KeyboardLayoutKey[]
  mainKeyRows: KeyboardLayoutKey[][]
  controlKeyRows: KeyboardLayoutKey[][]
}

export interface KeyboardLayoutKey {
  key: string
  widthScale: number
}
