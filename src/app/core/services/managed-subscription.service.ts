import { Subscription, SubscriptionLike } from 'rxjs'

export class ManagedSubscription implements SubscriptionLike {
    constructor(private readonly subscription: Subscription, private readonly subscriptionHandler: () => void) { }

    get closed(): boolean {
        return this.subscription.closed
    }

    public unsubscribe() {
        this.subscription.unsubscribe()
        this.subscriptionHandler()
    }
}
