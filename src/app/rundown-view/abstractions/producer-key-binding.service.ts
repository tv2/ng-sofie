import { Observable } from 'rxjs'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { Injectable } from '@angular/core'
import { Rundown } from '../../core/models/rundown'

@Injectable()
export abstract class ProducerKeyBindingService {
  public abstract init(rundown: Rundown): void
  public abstract subscribeToKeyBindings(): Observable<KeyBinding[]>
  public abstract destroy(): void
}
