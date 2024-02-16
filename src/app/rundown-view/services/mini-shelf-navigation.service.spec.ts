import { MiniShelfNavigationService } from './mini-shelf-navigation.service'

function createTestee(): MiniShelfNavigationService {
  return new MiniShelfNavigationService()
}

describe(MiniShelfNavigationService.name, () => {
  it('should create', () => {
    const testee: MiniShelfNavigationService = createTestee()

    expect(testee).toBeTruthy()
  })
})
