import { Component, ElementRef, HostBinding, OnDestroy, OnInit } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { SubscriptionLike } from 'rxjs'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { ActivatedRoute } from '@angular/router'
import { Logger } from '../../../core/abstractions/logger.service'
import { KeyboardConfigurationService } from '../../abstractions/keyboard-configuration.service'
import { KeyBinding } from '../../../keyboard/value-objects/key-binding'

@Component({
  selector: 'sofie-rundown-view',
  templateUrl: './rundown-view.component.html',
  styleUrls: ['./rundown-view.component.scss'],
})
export class RundownViewComponent implements OnInit, OnDestroy {
  public rundown?: Rundown
  private rundownSubscription?: SubscriptionLike
  private readonly logger: Logger
  public keyBindings: KeyBinding[] = []
  public keystrokes: string[] = []

  @HostBinding('tabindex')
  public get tabindex(): string {
    return '0'
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rundownStateService: RundownStateService,
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
    this.rundownStateService
      .subscribeToRundown(rundownId, this.setRundown.bind(this))
      .then(rundownSubscription => (this.rundownSubscription = rundownSubscription))
      .catch(error => this.logger.data(error).error(`Failed subscribing to rundown with id '${rundownId}'.`))
  }

  private setRundown(rundown: Rundown): void {
    if (!this.rundown) {
      this.keyboardConfigurationService.init(rundown.id, this.hostElement.nativeElement)
      this.keyboardConfigurationService.subscribeToKeystrokes(keystrokes => (this.keystrokes = keystrokes))
      this.keyboardConfigurationService.subscribeToKeyBindings(keyBindings => (this.keyBindings = keyBindings))
      this.hostElement.nativeElement.focus()
    }
    this.rundown = rundown
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
    this.keyboardConfigurationService.destroy()
  }
}
