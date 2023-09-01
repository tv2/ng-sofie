import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AdLibPieceIdentifierComponent } from './ad-lib-piece-identifier.component';
import { instance, mock } from '@typestrong/ts-mockito'
import { AdLibPieceService } from '../../../core/services/ad-lib-piece.service'

describe('AdLibPieceIdentifierComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy();
  })
})

async function configureTestBed(params: { maybeAdLibPieceServiceMock?: AdLibPieceService } = {}): Promise<AdLibPieceIdentifierComponent> {
  const adLibPieceServiceMock = params.maybeAdLibPieceServiceMock ?? createMockOfAdLibPieceService()
  await TestBed
    .configureTestingModule({
      providers: [
        { provide: AdLibPieceService, useValue: instance(adLibPieceServiceMock) }
      ],
      declarations: [AdLibPieceIdentifierComponent]
    })
    .compileComponents()

  const fixture: ComponentFixture<AdLibPieceIdentifierComponent> = TestBed.createComponent(AdLibPieceIdentifierComponent)
  return fixture.componentInstance
}

function createMockOfAdLibPieceService(): AdLibPieceService {
  return mock<AdLibPieceService>()
}
