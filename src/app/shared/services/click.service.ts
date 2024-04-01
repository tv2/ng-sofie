import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable()
export class ClickService {
  public clickSubject: Subject<MouseEvent>
  public clickObservable: Observable<MouseEvent>

  constructor() {
    this.clickSubject = new Subject<MouseEvent>()
    this.clickObservable = this.clickSubject.asObservable()
  }

  public onClick(clickEvent: MouseEvent): void {
    const value = clickEvent
    this.clickSubject.next(value)
  }
}
