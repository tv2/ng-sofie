import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { ShowStyleVariant } from '../models/show-style-variant'
import { ShowStyleVariantService } from '../abstractions/show-style-variant.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'

@Injectable()
export class ShowStyleVariantStateService implements OnDestroy {
  private readonly showStyleVariantSubjects: Map<string, BehaviorSubject<ShowStyleVariant>> = new Map()
  private readonly eventSubscriptions: EventSubscription[]

  constructor(private readonly showStyleVariantService: ShowStyleVariantService) {}

  public async subscribeToShowStyleVariant(rundownId: string): Promise<Observable<ShowStyleVariant>> {
    const showStyleVariantSubject: BehaviorSubject<ShowStyleVariant> = await this.getShowStyleVariantSubject(rundownId)
    return showStyleVariantSubject.asObservable()
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

  public ngOnDestroy(): void {
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }
}
