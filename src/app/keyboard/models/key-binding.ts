export type Keys = [string, ...string[]]
export interface KeyBinding {
  readonly keys: Keys
  readonly label: string
  readonly onMatched: () => void
  readonly shouldMatchOnKeyRelease: boolean
  readonly useExclusiveMatching: boolean
  readonly useOrderedMatching: boolean
  readonly shouldPreventDefaultBehaviourOnKeyPress: boolean
  readonly shouldPreventDefaultBehaviourForPartialMatches: boolean
}
