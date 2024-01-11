import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { Logger } from '../../../core/abstractions/logger.service'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-minishelf',
  templateUrl: './minishelf.component.html',
  styleUrls: ['./minishelf.component.scss'],
})
export class MinishelfComponent implements OnChanges, OnDestroy {
  @Input()
  public segment: Segment

  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger.tag('MinishelfComponent')
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.logger.info('ngOnChanges for MinishelfComponent', changes)
  }
  public ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy for MinishelfComponent')
  }
}
