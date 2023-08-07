import {Injectable} from '@angular/core';
import {RundownEventServiceInterface} from '../interfaces/rundown-event-service-interface';

@Injectable()
export class MockRundownEventService implements RundownEventServiceInterface {

  private callback: (event: any) => void

  public listenForRundownEvents(rundownId: string, onEvent: (event: any) => void): WebSocket {
    this.callback = onEvent
    return {
      close(code?: number, reason?: string) {
      }
    } as WebSocket
  }

  public doMockEvent(eventData: any): void {
    this.callback(eventData)
  }
}
