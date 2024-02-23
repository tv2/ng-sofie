import { NotificationComponent } from './notification.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ElementRef } from '@angular/core'

describe('NotificationComponent', () => {
  it('should create', () => {
    const testee: NotificationComponent = new NotificationComponent(instance(mock(ElementRef)))
    expect(testee).toBeTruthy()
  })
})
