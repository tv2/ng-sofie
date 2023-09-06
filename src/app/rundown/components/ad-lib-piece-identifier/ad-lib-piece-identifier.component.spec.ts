import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AdLibPieceIdentifierComponent } from './ad-lib-piece-identifier.component';
import { instance, mock } from '@typestrong/ts-mockito'
import { AdLibPieceService } from '../../../core/interfaces/ad-lib-piece-service.interface'

describe('AdLibPieceIdentifierComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy();
  })
})

async function configureTestBed(params: { mockedAdLibPieceServiceMock?: AdLibPieceService } = {}): Promise<AdLibPieceIdentifierComponent> {
  const mockedAdLibPieceService = params.mockedAdLibPieceServiceMock ?? mock<AdLibPieceService>()
  await TestBed
    .configureTestingModule({
      providers: [
        { provide: AdLibPieceService, useValue: instance(mockedAdLibPieceService) }
      ],
      declarations: [AdLibPieceIdentifierComponent]
    })
    .compileComponents()

  const fixture: ComponentFixture<AdLibPieceIdentifierComponent> = TestBed.createComponent(AdLibPieceIdentifierComponent)
  return fixture.componentInstance
}
