import { ZodActionTriggerEventParser } from './zod-action-trigger-event-parser.service'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from '../models/action-trigger-event'
import { ActionTriggerEventType } from '../models/action-trigger-event-type'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'

describe(ZodActionTriggerEventParser.name, () => {
  describe(ZodActionTriggerEventParser.prototype.parseActionTriggerCreatedEvent.name, () => {
    it('parses an ActionTrigger created event', () => {
      const createActionTriggerParserMock = createMockOfActionTriggerParser()
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser(instance(createActionTriggerParserMock))
      const event: ActionTriggerCreatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_CREATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            keys: ['randomKey'],
            label: 'randomLabel',
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
      const createActionTriggerParserMock = createMockOfActionTriggerParser()
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser(instance(createActionTriggerParserMock))
      const event: ActionTriggerUpdatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_UPDATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            keys: ['randomKey'],
            label: 'randomLabel',
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
      const createActionTriggerParserMock = createMockOfActionTriggerParser()
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser(instance(createActionTriggerParserMock))
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
  when(mockedActionTriggerParser.parseActionTriggerData(anything())).thenCall(data => data)
  return mockedActionTriggerParser
}
