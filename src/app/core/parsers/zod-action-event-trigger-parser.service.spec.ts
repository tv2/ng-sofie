import { ZodActionTriggerEventParser } from './zod-action-trigger-event-parser.service'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from '../models/action-trigger-event'
import { ActionTriggerEventType } from '../models/action-trigger-event-type'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'

describe(ZodActionTriggerEventParser.name, () => {
  describe(ZodActionTriggerEventParser.prototype.parseActionTriggerCreatedEvent.name, () => {
    it('parses an ActionTrigger created event', () => {
      const actionTriggerParser: ActionTriggerParser = createMockOfActionTriggerParser()
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser(instance(actionTriggerParser))
      const event: ActionTriggerCreatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_CREATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            keys: ['randomKey'],
            label: 'randomLabel',
            triggerOn: KeyEventType.PRESSED,
            actionArguments: 100,
          },
        },
      }
      const result: ActionTriggerCreatedEvent = testee.parseActionTriggerCreatedEvent(event)
      expect(result).toEqual(event)
    })
  })

  describe(ZodActionTriggerEventParser.prototype.parseActionTriggerUpdatedEvent.name, () => {
    it('parses an ActionTrigger updated event', () => {
      const actionTriggerParser: ActionTriggerParser = createMockOfActionTriggerParser()
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser(instance(actionTriggerParser))
      const event: ActionTriggerUpdatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_UPDATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            keys: ['randomKey'],
            label: 'randomLabel',
            triggerOn: KeyEventType.PRESSED,
            actionArguments: 100,
          },
        },
      }
      const result: ActionTriggerUpdatedEvent = testee.parseActionTriggerUpdatedEvent(event)
      expect(result).toEqual(event)
    })
  })

  describe(ZodActionTriggerEventParser.prototype.parseActionTriggerDeletedEvent.name, () => {
    it('parses an ActionTrigger deleted event', () => {
      const actionTriggerParser: ActionTriggerParser = createMockOfActionTriggerParser()
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser(instance(actionTriggerParser))
      const event: ActionTriggerDeletedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_DELETED,
        timestamp: Date.now(),
        actionTriggerId: 'someActionTriggerId',
      }
      const result: ActionTriggerDeletedEvent = testee.parseActionTriggerDeletedEvent(event)
      expect(result).toEqual(event)
    })
  })
})

function createMockOfActionTriggerParser(): ActionTriggerParser {
  const mockedActionTriggerParser = mock<ActionTriggerParser>()
  when(mockedActionTriggerParser.parseActionTrigger(anything())).thenCall(data => data)
  return mockedActionTriggerParser
}
