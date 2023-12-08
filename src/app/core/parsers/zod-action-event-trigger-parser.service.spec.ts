import { ZodActionTriggerEventParser } from './zod-action-trigger-event-parser.service'
import {
  ActionTriggerCreatedEvent,
  ActionTriggerDeletedEvent,
  ActionTriggerUpdatedEvent
} from '../models/action-trigger-event'
import { ActionTriggerEventType } from '../models/action-trigger-event-type'

describe(ZodActionTriggerEventParser.name, () => {
  describe(ZodActionTriggerEventParser.prototype.parseActionTriggerCreatedEvent.name, () => {
    it('parses an ActionTrigger created event', () => {
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser()
      const event: ActionTriggerCreatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_CREATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            some: 'data'
          }
        }
      }
      const result: ActionTriggerCreatedEvent = testee.parseActionTriggerCreatedEvent(event)
      expect(result).toEqual(event)
    })
  })

  describe(ZodActionTriggerEventParser.prototype.parseActionTriggerUpdatedEvent.name, () => {
    it('parses an ActionTrigger updated event', () => {
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser()
      const event: ActionTriggerUpdatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_UPDATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            some: 'data'
          }
        }
      }
      const result: ActionTriggerUpdatedEvent = testee.parseActionTriggerUpdatedEvent(event)
      expect(result).toEqual(event)
    })
  })

  describe(ZodActionTriggerEventParser.prototype.parseActionTriggerDeletedEvent.name, () => {
    it('parses an ActionTrigger deleted event', () => {
      const testee: ZodActionTriggerEventParser = new ZodActionTriggerEventParser()
      const event: ActionTriggerDeletedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_DELETED,
        timestamp: Date.now(),
        actionTriggerId: 'someActionTriggerId'
      }
      const result: ActionTriggerDeletedEvent = testee.parseActionTriggerDeletedEvent(event)
      expect(result).toEqual(event)
    })
  })
})
