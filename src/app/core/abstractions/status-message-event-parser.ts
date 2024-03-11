import { Injectable } from '@angular/core'
import { StatusMessageEvent } from '../models/status-message-event'

@Injectable()
export abstract class StatusMessageEventParser {
  public abstract parseStatusMessageEvent(event: unknown): StatusMessageEvent
}
