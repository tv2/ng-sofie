import { ManagedSubscription } from './managed-subscription.service'
import { instance, mock, verify } from '@typestrong/ts-mockito'
import { Subscription } from 'rxjs'

describe(ManagedSubscription.name, () => {
  describe(ManagedSubscription.prototype.unsubscribe.name, () => {
    it('calls the unsubscribe handler after subscription unsubscribe', () => {
      const mockedSubscription = mock<Subscription>()
      const mockedUnsubscribeHandlerObject = mock<{ unsubscribe: () => void }>()
      const testee = new ManagedSubscription(instance(mockedSubscription), instance(mockedUnsubscribeHandlerObject).unsubscribe)

      testee.unsubscribe()

      verify(mockedUnsubscribeHandlerObject.unsubscribe()).calledAfter(mockedSubscription.unsubscribe())
    })
  })
})
