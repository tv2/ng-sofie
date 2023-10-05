import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, lastValueFrom, Subscription, SubscriptionLike } from 'rxjs'
import { ShowStyleVariant } from '../models/show-style-variant'
import { ShowStyleVariantService } from '../abstractions/show-style-variant.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ManagedSubscription } from './managed-subscription.service'

@Injectable()
export class ShowStyleVariantStateService implements OnDestroy {
  private readonly showStyleVariantSubjects: Map<string, BehaviorSubject<ShowStyleVariant>> = new Map()
  private readonly eventSubscriptions: EventSubscription[]

  constructor(private readonly showStyleVariantService: ShowStyleVariantService) {}

  public async subscribeToShowStyleVariant(rundownId: string, consumer: (showStyleVariant: ShowStyleVariant) => void): Promise<SubscriptionLike> {
    const showStyleVariantSubject: BehaviorSubject<ShowStyleVariant> = await this.getShowStyleVariantSubject(rundownId)
    const subscription: Subscription = showStyleVariantSubject.subscribe(consumer)
    return new ManagedSubscription(subscription, () => this.unsubscribeFromShowStyleVariant(rundownId))
  }

  private async getShowStyleVariantSubject(rundownId: string): Promise<BehaviorSubject<ShowStyleVariant>> {
    const showStyleVariantSubject: BehaviorSubject<ShowStyleVariant> | undefined = this.showStyleVariantSubjects.get(rundownId)
    if (showStyleVariantSubject) {
      return showStyleVariantSubject
    }
    const cleanShowStyleVariantSubject = await this.getCleanRundownSubject(rundownId)
    this.showStyleVariantSubjects.set(rundownId, cleanShowStyleVariantSubject)
    return cleanShowStyleVariantSubject
  }

  private async getCleanRundownSubject(rundownId: string): Promise<BehaviorSubject<ShowStyleVariant>> {
    const showStyleVariant: ShowStyleVariant = await this.fetchShowStyleVariant(rundownId)
    return new BehaviorSubject<ShowStyleVariant>(showStyleVariant)
  }

  private async fetchShowStyleVariant(rundownId: string): Promise<ShowStyleVariant> {
    return lastValueFrom(this.showStyleVariantService.getShowStyleVariant(rundownId))
  }

  private unsubscribeFromShowStyleVariant(rundownId: string): void {
    const rundownSubject: BehaviorSubject<ShowStyleVariant> | undefined = this.showStyleVariantSubjects.get(rundownId)
    if (!rundownSubject) {
      return
    }
    if (rundownSubject.observed) {
      return
    }
    rundownSubject.unsubscribe()
    this.showStyleVariantSubjects.delete(rundownId)
  }

  public ngOnDestroy(): void {
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }
}
