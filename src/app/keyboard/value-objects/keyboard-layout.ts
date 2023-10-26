export interface KeyboardLayout {
  name: string
  functionKeyRow: KeyboardLayoutKey[]
  mainKeyRows: KeyboardLayoutKey[][]
  controlKeyRows: KeyboardLayoutKey[][]
}

export interface KeyboardLayoutKey {
  key: string
  label: string
  widthScale: number
}

export const EMPTY_KEY = '<empty>'
