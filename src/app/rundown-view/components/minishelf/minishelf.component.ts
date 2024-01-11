import { Component, Input } from '@angular/core'
import { Logger } from '../../../core/abstractions/logger.service'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-minishelf',
  templateUrl: './minishelf.component.html',
  styleUrls: ['./minishelf.component.scss'],
})
export class MinishelfComponent {
  private readonly logger: Logger
  private readonly data: { prop: string }
  @Input() segment!: Segment
  private readonly part: Part
  constructor(logger: Logger) {
    this.logger = logger.tag('MinishelfComponent')
    this.data = { prop: 'value' }
  }
}
