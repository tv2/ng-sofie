import { ZodActionTriggerEventValidator } from './zod-action-trigger-event-validator.service'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from '../models/action-trigger-event'
import { ActionTriggerEventType } from '../models/action-trigger-event-type'

describe(ZodActionTriggerEventValidator.name, () => {
  describe(ZodActionTriggerEventValidator.prototype.parseActionTriggerCreatedEvent.name, () => {
    it('parses an ActionTrigger created event', () => {
      const testee: ZodActionTriggerEventValidator = new ZodActionTriggerEventValidator()
      const event: ActionTriggerCreatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_CREATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            keys: ['randomKey'],
            actionArguments: 100,
          },
        },
      }
      const result: ActionTriggerCreatedEvent = testee.parseActionTriggerCreatedEvent(event)
      expect(result).toEqual(event)
    })
  })

  describe(ZodActionTriggerEventValidator.prototype.parseActionTriggerUpdatedEvent.name, () => {
    it('parses an ActionTrigger updated event', () => {
      const testee: ZodActionTriggerEventValidator = new ZodActionTriggerEventValidator()
      const event: ActionTriggerUpdatedEvent = {
        type: ActionTriggerEventType.ACTION_TRIGGER_UPDATED,
        timestamp: Date.now(),
        actionTrigger: {
          id: 'someActionTriggerId',
          actionId: 'someActionId',
          data: {
            keys: ['randomKey'],
            actionArguments: 100,
          },
        },
      }
      const result: ActionTriggerUpdatedEvent = testee.parseActionTriggerUpdatedEvent(event)
      expect(result).toEqual(event)
    })
  })

  describe(ZodActionTriggerEventValidator.prototype.parseActionTriggerDeletedEvent.name, () => {
    it('parses an ActionTrigger deleted event', () => {
      const testee: ZodActionTriggerEventValidator = new ZodActionTriggerEventValidator()
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
