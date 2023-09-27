import { TestBed } from '@angular/core/testing';

import { OffsetablePartComponent } from './offsetable-part.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Part } from '../../../core/models/part'
import { PieceLayerService } from '../../../shared/services/piece-layer.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'

describe(OffsetablePartComponent.name, () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(OffsetablePartComponent)
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
  return mockedPart
}

async function configureTestBed(): Promise<void> {
  const mockedPieceLayerService: PieceLayerService = mock<PieceLayerService>()
  const mockedRundownService: RundownService = mock<RundownService>()
  const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
  await TestBed.configureTestingModule({
    declarations: [OffsetablePartComponent],
    imports: [BrowserAnimationsModule],
    providers: [
      { provide: PieceLayerService, useValue: instance(mockedPieceLayerService) },
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: PartEntityService, useValue: instance(mockedPartEntityService) },
    ]
  }).compileComponents()
}
