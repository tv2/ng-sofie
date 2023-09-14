import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartComponent } from './part.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Part } from '../../../core/models/part'
import { PieceLayerService } from '../../../shared/services/piece-layer.service'

describe('PartComponent', () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(PartComponent)
    const component = fixture.componentInstance
    const mockedPart = getMockedPart()
    component.part = instance(mockedPart)
    fixture.detectChanges()
    expect(component).toBeTruthy();
  });
});

function getMockedPart(): Part {
  const mockedPart = mock<Part>()
  when(mockedPart.id).thenReturn('some-part-id')
  when(mockedPart.segmentId).thenReturn('some-segment-id')
  when(mockedPart.isOnAir).thenReturn(false)
  when(mockedPart.isNext).thenReturn(false)
  when(mockedPart.pieces).thenReturn([])
  when(mockedPart.adLibPieces).thenReturn([])
  return mockedPart
}

async function configureTestBed(): Promise<void> {
  const mockedPieceLayerService: PieceLayerService = mock<PieceLayerService>()
  await TestBed.configureTestingModule({
    declarations: [PartComponent],
    imports: [BrowserAnimationsModule],
    providers: [
      { provide: PieceLayerService, useValue: instance(mockedPieceLayerService) },
    ]
  }).compileComponents()
}
