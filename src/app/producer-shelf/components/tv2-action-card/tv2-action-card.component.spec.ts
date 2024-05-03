import { Tv2ActionCardComponent } from './tv2-action-card.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { ChangeDetectorRef, ElementRef } from '@angular/core'

describe('ActionCardComponent', () => {
  it('should create', () => {
    const testee: Tv2ActionCardComponent = new Tv2ActionCardComponent(instance(mock(ConfigurationService)), instance(mock(ChangeDetectorRef)), instance(mock(ElementRef)))
    expect(testee).toBeTruthy()
  })
})
