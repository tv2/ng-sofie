import { TestBed } from '@angular/core/testing'

import { OffsetablePartComponent } from './offsetable-part.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Part } from '../../../core/models/part'
import { RundownService } from '../../../shared/abstractions/rundown.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Tv2PieceGroupService } from '../../services/tv2-piece-group.service'

describe(OffsetablePartComponent.name, () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(OffsetablePartComponent)
    const component = fixture.componentInstance
    const mockedPart = getMockedPart()
    component.part = instance(mockedPart)
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})

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
  const mockedRundownService: RundownService = mock<RundownService>()
  const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
  const mockedPieceGroupService: Tv2PieceGroupService = mock<Tv2PieceGroupService>()
  await TestBed.configureTestingModule({
    declarations: [OffsetablePartComponent],
    imports: [BrowserAnimationsModule],
    providers: [
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: PartEntityService, useValue: instance(mockedPartEntityService) },
      { provide: Tv2PieceGroupService, useValue: instance(mockedPieceGroupService) },
    ],
  }).compileComponents()
}
