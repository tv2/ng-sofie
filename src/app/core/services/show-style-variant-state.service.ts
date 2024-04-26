import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { ShowStyleVariant } from '../models/show-style-variant'
import { ShowStyleVariantService } from '../abstractions/show-style-variant.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { Logger } from '../abstractions/logger.service'

@Injectable()
export class ShowStyleVariantStateService implements OnDestroy {
  private readonly showStyleVariantSubjects: Map<string, BehaviorSubject<ShowStyleVariant>> = new Map()
  private readonly eventSubscriptions: EventSubscription[] = []
  private readonly logger: Logger

  constructor(
    private readonly showStyleVariantService: ShowStyleVariantService,
    private readonly rundownEventObserver: RundownEventObserver,
    logger: Logger
  ) {
    this.logger = logger.tag('ShowStyleVariantStateService')
    this.eventSubscriptions.push(this.rundownEventObserver.subscribeToRundownUpdates(event => this.updateShowStyleVariantForRundown(event.rundownId)))
  }

  private updateShowStyleVariantForRundown(rundownId: string): void {
    this.getCleanShowStyleVariantSubject(rundownId)
      .then(newVariant => {
        const showStyleVariantSubject: BehaviorSubject<ShowStyleVariant> | undefined = this.showStyleVariantSubjects.get(rundownId)
        if (!showStyleVariantSubject) {
          return
        }
        showStyleVariantSubject.next(newVariant.value)
      })
      .catch(error => this.logger.data(error).error('Failed getting clean showstyle variant subject.'))
  }

  public async subscribeToShowStyleVariant(rundownId: string): Promise<Observable<ShowStyleVariant>> {
    const showStyleVariantSubject: BehaviorSubject<ShowStyleVariant> = await this.getShowStyleVariantSubject(rundownId)
    return showStyleVariantSubject.asObservable()
  }

  private async getShowStyleVariantSubject(rundownId: string): Promise<BehaviorSubject<ShowStyleVariant>> {
    const showStyleVariantSubject: BehaviorSubject<ShowStyleVariant> | undefined = this.showStyleVariantSubjects.get(rundownId)
    if (showStyleVariantSubject) {
      return showStyleVariantSubject
    }
    const cleanShowStyleVariantSubject = await this.getCleanShowStyleVariantSubject(rundownId)
    this.showStyleVariantSubjects.set(rundownId, cleanShowStyleVariantSubject)
    return cleanShowStyleVariantSubject
  }

  private async getCleanShowStyleVariantSubject(rundownId: string): Promise<BehaviorSubject<ShowStyleVariant>> {
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
