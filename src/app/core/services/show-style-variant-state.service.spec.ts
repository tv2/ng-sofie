import { instance, mock } from '@typestrong/ts-mockito'
import { ShowStyleVariantService } from '../../shared/abstractions/show-style-variant.service'
import { ShowStyleVariantStateService } from './show-style-variant-state.service'

describe('ShowStyleVariantStateService', () => {
  it('should be created', () => {
    const mockedShowStyleVariantService = mock<ShowStyleVariantService>()
    const testee = new ShowStyleVariantStateService(instance(mockedShowStyleVariantService))
    expect(testee).toBeTruthy()
  })
})
