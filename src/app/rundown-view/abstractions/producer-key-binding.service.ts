import { Observable } from 'rxjs'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { Injectable } from '@angular/core'

@Injectable()
export abstract class ProducerKeyBindingService {
  public abstract init(rundownId: string): void
  public abstract subscribeToKeyBindings(): Observable<KeyBinding[]>
  public abstract destroy(): void
}
