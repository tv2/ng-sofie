import { Component, ElementRef, HostBinding, OnDestroy, OnInit } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { ActivatedRoute } from '@angular/router'
import { Logger } from '../../../core/abstractions/logger.service'
import { KeyboardConfigurationService } from '../../abstractions/keyboard-configuration.service'
import { KeyBinding } from '../../../keyboard/value-objects/key-binding'
import { ConnectionStatusObserver } from '../../../core/services/connection-status-observer.service'
import { EventSubscription } from '../../../event-system/abstractions/event-observer.service'

@Component({
  selector: 'sofie-rundown-view',
  templateUrl: './rundown-view.component.html',
  styleUrls: ['./rundown-view.component.scss'],
})
export class RundownViewComponent implements OnInit, OnDestroy {
  public rundown?: Rundown
  private connectionStatusSubscription: EventSubscription
  private rundownSubscription?: EventSubscription
  private readonly logger: Logger
  public keyBindings: KeyBinding[] = []
  public keystrokes: string[] = []
  public rundownWasRemoved: boolean
  public isLoadingRundown: boolean = true

  @HostBinding('tabindex')
  public get tabindex(): string {
    return '0'
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rundownStateService: RundownStateService,
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly keyboardConfigurationService: KeyboardConfigurationService,
    logger: Logger,
    private readonly hostElement: ElementRef
  ) {
    this.logger = logger.tag('RundownViewComponent')
  }

  public ngOnInit(): void {
    const rundownId: string | null = this.route.snapshot.paramMap.get('rundownId')
    if (!rundownId) {
      this.logger.error("No rundownId found. Can't fetch Rundown")
      return
    }
    this.connectionStatusSubscription = this.connectionStatusObserver.subscribeToReconnect(() => this.subscribeToRundown(rundownId))
    this.subscribeToRundown(rundownId)
  }

  private subscribeToRundown(rundownId: string): void {
    if (this.rundownSubscription) {
      return
    }
    this.rundownStateService
      .subscribeToRundown(rundownId)
      .then(rundownObservable => (this.rundownSubscription = rundownObservable.subscribe(this.setRundown.bind(this))))
      .catch(error => this.logger.data(error).error(`Failed subscribing to rundown with id '${rundownId}'.`))
  }

  private setRundown(rundown: Rundown | undefined): void {
    if (!this.rundown && rundown) {
      this.keyboardConfigurationService.init(rundown.id, this.hostElement.nativeElement)
      this.keyboardConfigurationService.subscribeToKeystrokes(keystrokes => (this.keystrokes = keystrokes))
      this.keyboardConfigurationService.subscribeToKeyBindings(keyBindings => (this.keyBindings = keyBindings))
      this.hostElement.nativeElement.focus()
    }
    this.isLoadingRundown = false
    this.rundownWasRemoved = !!this.rundown && !rundown
    this.rundown = rundown
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
    this.connectionStatusSubscription?.unsubscribe
    this.keyboardConfigurationService.destroy()
  }
}
