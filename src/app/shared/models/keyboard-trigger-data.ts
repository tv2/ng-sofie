import { Keys } from 'src/app/keyboard/value-objects/key-binding'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'

export interface KeyboardTriggerData {
  keys: Keys
  actionArguments?: string | number
  label: string
  triggerOn: KeyEventType
  mappedToKeys?: Keys
}
