export interface KeyBinding {
  readonly key: string
  readonly modifiers: string[]
  readonly label: string
  readonly action: () => void
  readonly onKeyPress: boolean
}
