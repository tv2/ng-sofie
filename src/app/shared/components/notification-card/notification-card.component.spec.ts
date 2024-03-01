import { NotificationCardComponent } from './notification-card.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ElementRef } from '@angular/core'

describe(NotificationCardComponent.name, () => {
  it('should create', () => {
    const testee: NotificationCardComponent = new NotificationCardComponent(instance(mock(ElementRef)))
    expect(testee).toBeTruthy()
  })
})
